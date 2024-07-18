package pck.mindspace.configs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    public static final String REDIS_BEAN = "myredis";

   @Value("${spring.data.redis.host}")
   private String redisHost;

   @Value("${spring.data.redis.port}")
   private int redisPort;

   @Value("${spring.data.redis.database}")
   private int redisDatabase;

   @Value("${spring.data.redis.username}")
   private String redisUsername;

   @Value("${spring.data.redis.password}")
   private String redisPassword;

   @Bean(REDIS_BEAN) // Factory method
   public RedisTemplate<String, String> createRedis() {

      RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
      config.setHostName(redisHost);
      config.setPort(redisPort);
      config.setDatabase(redisDatabase);

      // Only set username and password if they are present
      if (redisUsername.trim().length() > 0) {
         config.setUsername(redisUsername);
         config.setPassword(redisPassword);
      }

      JedisClientConfiguration jedisClient = JedisClientConfiguration
            .builder().build();
      JedisConnectionFactory fac = new JedisConnectionFactory(config, jedisClient);
      fac.afterPropertiesSet();

      RedisTemplate<String, String> template = new RedisTemplate<>();
      template.setConnectionFactory(fac);
      template.setKeySerializer(new StringRedisSerializer());
      template.setValueSerializer(new StringRedisSerializer());
      template.setHashKeySerializer(new StringRedisSerializer());
      template.setHashValueSerializer(new StringRedisSerializer());

      return template;
   }
}
