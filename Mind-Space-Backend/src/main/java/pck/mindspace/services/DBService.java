package pck.mindspace.services;

import java.util.Collections;
import java.util.LinkedList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pck.mindspace.repos.RedisRepo;
import pck.mindspace.repos.SQLRepo;

@Service
public class DBService {

    @Autowired
    RedisRepo redisRepo;

    @Autowired
    SQLRepo sqlRepo;

    // redis
    public LinkedList<String[]> getHighScoreOfTheDay() {
        LinkedList<String[]> temp = redisRepo.getHighScoreOfTheDay();
        LinkedList<Double> sortList = new LinkedList<>();
        LinkedList<String[]> sortedScores = new LinkedList<>();

        // 0 username, 1 string score
        // doing leetcode at 6am half dead is not fun
        for (String[] x : temp) {
            sortList.add(Double.parseDouble(x[1]));
        }
        Collections.sort(sortList, Collections.reverseOrder());

        while (temp.size() > 0) {
            String tempUsername = "";
            int tempScore = 0;

            // find index of the highest string score in temp
            for (int x = 0; x < temp.size(); x++) {
                if (Double.parseDouble(temp.get(x)[1]) == sortList.getFirst()) {
                    tempScore = (int)Double.parseDouble(temp.get(x)[1]);
                    tempUsername = temp.get(x)[0];
                    temp.remove(x);
                    break;
                }
            }

            sortedScores.add(new String[]{tempUsername, String.valueOf(tempScore)});
            sortList.removeFirst();
        }

        return sortedScores;
    }

    public boolean updatePersonalHighScore(String username, double submittedScore) {
        return sqlRepo.updatePersonalHighScore(username, submittedScore);
    }

    public boolean updateRedisHighScore(String username, double submittedScore) {
        return redisRepo.updateHighScore(username, submittedScore);
    }

    public boolean updateHallOfFame(String username, double submittedScore) {
        return sqlRepo.updateAllTimeHighScore(username, submittedScore);
    }

    public int loginCheck(String username, String password) {

        // if username does not exist   (i could just return 1 string n split it to reduce db calls....i could)
        if (!sqlRepo.doesUsernameExist(username)) {
            return 0;
        } else if (!sqlRepo.getUserPassword(username).equals(password)) {
            // if wrong password
            return 1;
        }

        return 2;
    }

    public String getUserPersonalHighScore(String username) {
        return sqlRepo.getPersonalHighScore(username);
    }

    // TODO sql create account
    public String createAccount(String username, String password) {

        return "";
    }

    public LinkedList<String[]> getHallOfFame() {
        return sqlRepo.getHallOfFame();
    }
}
