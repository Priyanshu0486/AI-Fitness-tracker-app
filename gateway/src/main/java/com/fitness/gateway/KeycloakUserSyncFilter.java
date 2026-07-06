package com.fitness.gateway;

import com.fitness.gateway.user.RegisterRequest;
import com.fitness.gateway.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        // Skip sync if no token present
        if (token == null) {
            return chain.filter(exchange);
        }

        RegisterRequest request = getUserDetailsFromToken(token);
        if (request == null) {
            return chain.filter(exchange);
        }

        if (userId == null) {
            userId = request.getKeycloakId();
        }
        final String finalUserId = userId;
        if (finalUserId != null) {
            return userService.validateUser(finalUserId)
                    .onErrorResume(e -> {
                        log.warn("Error validating user, skipping sync: {}", e.getMessage());
                        return Mono.just(false);
                    })
                    .flatMap(exist -> {
                        if (!exist) {
                            // register
                            RegisterRequest registerRequest = getUserDetailsFromToken(token);
                            if (registerRequest != null) {
                                return userService.register(registerRequest)
                                        .onErrorResume(e -> {
                                            log.warn("Error registering user, skipping: {}", e.getMessage());
                                            return Mono.empty();
                                        })
                                        .then(Mono.empty());
                            } else {
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exists, Skipping sync!");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);

    }

    private RegisterRequest getUserDetailsFromToken(String token) {
        try {
            String tokenWithoutBearer = token.replace("Bearer", "").trim();
            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();
            RegisterRequest registerRequest = new RegisterRequest();
            String email = claims.getStringClaim("email");
            if (email == null) {
                email = claims.getStringClaim("preferred_username") + "@test.com";
            }
            registerRequest.setEmail(email);
            
            String firstName = claims.getStringClaim("given_name");
            registerRequest.setFirstName(firstName != null ? firstName : "User");
            
            String lastName = claims.getStringClaim("family_name");
            registerRequest.setLastName(lastName != null ? lastName : "");
            
            registerRequest.setKeycloakId(claims.getStringClaim("sub"));
            registerRequest.setPassword("dummy123123");
            return registerRequest;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
