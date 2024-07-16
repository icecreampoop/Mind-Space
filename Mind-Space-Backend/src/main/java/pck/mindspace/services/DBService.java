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

    public LinkedList<String[]> getHighScoreOfTheDay() {
        LinkedList<String[]> temp = redisRepo.getHighScoreOfTheDay();
        LinkedList<Double> sortList = new LinkedList<>();
        LinkedList<String[]> sortedScores = new LinkedList<>();

        //0 username, 1 string score
        //doing leetcode at 6am half dead is not fun
        for (String[] x : temp) {
            sortList.add(Double.parseDouble(x[1]));
        }
        Collections.sort(sortList, Collections.reverseOrder());

        while(temp.size()>0) {
            int tempIndex = 0;

            //find index of the highest string score in temp
            for (int x = 0; x < temp.size(); x++){
                if (Double.parseDouble(temp.get(x)[1])==sortList.getFirst()){
                    tempIndex = x;
                    break;
                }
            }

            sortedScores.add(temp.remove(tempIndex));
            sortList.removeFirst();
        }

        return sortedScores;
    }

    public void updateHighScore(String username, double submittedScore) {
        redisRepo.updateHighScore(username, submittedScore);
        sqlRepo.updatePersonalHighScore(username, submittedScore);
        sqlRepo.updateAllTimeHighScore(username, submittedScore);
    }

    //TODO sql login
    public String login(String username, String password) {

        return "";
    }

    //TODO sql create account
    public String createAccount(String username, String password){

        return "";
    }

    //TODO SQL all time high score/hall of fame
    public LinkedList<String[]> getHallOfFame() {
        
        return new LinkedList<String[]>();
    }
}
