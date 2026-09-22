package com.fahrisnassief.dronetelemetry.config;

import com.fahrisnassief.dronetelemetry.model.DroneTelemetry;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers:34.61.44.104:9092}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, DroneTelemetry> postgresConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "postgres-consumer-v2");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 500);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.fahrisnassief.dronetelemetry.model");

        return new DefaultKafkaConsumerFactory<>(
                props,
                new ErrorHandlingDeserializer<>(new StringDeserializer()),
                new ErrorHandlingDeserializer<>(new JsonDeserializer<>(DroneTelemetry.class))
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, DroneTelemetry> postgresListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, DroneTelemetry> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(postgresConsumerFactory());
        factory.setBatchListener(true);
        factory.setConcurrency(1);
        factory.setAutoStartup(true);

        // Retry logic. Specifically if topic hasn't been created yet
        FixedBackOff backOff = new FixedBackOff(5000L, 10L);
        DefaultErrorHandler errorHandler = new DefaultErrorHandler((record, exception) -> {
            System.err.println("Failed after retries: " + record);
        }, backOff);

        factory.setCommonErrorHandler(errorHandler);
        return factory;

    }
}