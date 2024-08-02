package pck.mindspace.repos;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.LinkedList;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import pck.mindspace.configs.RedisConfig;

@Repository
public class RedisRepo {

    @Autowired
    @Qualifier(RedisConfig.REDIS_BEAN)
    private RedisTemplate<String, String> template;

    // time
    ZoneId sgZone = ZoneId.of("Asia/Singapore");
    private int expiryDuration = 86400 - LocalTime.now(sgZone).toSecondOfDay();

    private final String redisKey = "dailyrank";

    // get highscores of the day
    public LinkedList<String[]> getHighScoreOfTheDay() {
        LinkedList<String[]> temp = new LinkedList<>();
        // just wanna say ive been doing niche stuff that chatgpt cant help for bru
        if (template.opsForZSet().zCard(redisKey) > 0) {
            // incase need to debug, rangeWithScores is inclusive range
            for (var tuple : template.opsForZSet().rangeWithScores(redisKey, 0,
                    template.opsForZSet().zCard(redisKey) - 1)) {

                temp.add(new String[] { tuple.getValue(), tuple.getScore().toString() });
            }
        }

        // sorted in service, i triple checked, range returns a set??
        // whats the point of zset other than for pinging lowest/highest indiv items
        return temp;
    }

    // update highscore
    public boolean updateHighScore(String username, double submittedScore) {

        // if not full add straight
        if (5 > template.opsForZSet().zCard(redisKey)) {
            template.opsForZSet().add(redisKey, username, submittedScore);

            // set expire time based on singapore time to 0000
            expiryDuration = 86400 - LocalTime.now(sgZone).toSecondOfDay();
            template.expire(redisKey, expiryDuration, TimeUnit.SECONDS);
            return true;

        } else {
            // if higher than 5th pop lowest score and insert, once again 0, 0 cus
            // inclusive range
            // abit stupid to for loop 1 element but the set type i found
            // isZSetOperations.TypedTuple<V>
            // BUT I CANT FIND WHATS THE TYPE OF <V>    (future me to say this looks like wildcard but i cba to change the code)
            for (var tuple : template.opsForZSet().rangeWithScores(redisKey, 0, 0)) {
                if (submittedScore > tuple.getScore()) {
                    template.opsForZSet().popMin(redisKey);
                    template.opsForZSet().add(redisKey, username, submittedScore);

                    // set expire time based on singapore time to 0000
                    expiryDuration = 86400 - LocalTime.now(sgZone).toSecondOfDay();
                    template.expire(redisKey, expiryDuration, TimeUnit.SECONDS);
                    return true;
                }
            }

        }
        // nth was added so no need expire
        return false;
    }
}
