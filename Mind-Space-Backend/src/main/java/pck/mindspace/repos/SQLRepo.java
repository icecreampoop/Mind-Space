package pck.mindspace.repos;

import java.util.LinkedList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

@Repository
public class SQLRepo {

    @Autowired
    private JdbcTemplate template;

    // update personal high score
    public boolean updatePersonalHighScore(String username, double submittedScore) {
        final SqlRowSet rs = template.queryForRowSet(SQLQueries.GET_USER_INFO, username);
        rs.next();

        if (submittedScore > rs.getInt("score")) {
            template.update(SQLQueries.UPDATE_PERSONAL_SCORE, submittedScore, username);
            return true;
        } else {
            return false;
        }
    }

    // update hall of fame in sql (with check)
    public boolean updateAllTimeHighScore(String username, double submittedScore) {
        //if hall of fame not 5 yet
        SqlRowSet rs = template.queryForRowSet(SQLQueries.GET_HALL_OF_FAME_SIZE);
        rs.next();
        if (5 > rs.getInt("count")){
            template.update(SQLQueries.INSERT_NEW_HALL_OF_FAME, username, submittedScore);
            return true;
        }

        //check if score > lowest hall of fame
        rs = template.queryForRowSet(SQLQueries.GET_LOWEST_HALL_OF_FAME);
        rs.next();
        if (submittedScore > rs.getInt("score")){
            template.update(SQLQueries.DELETE_LOWEST_HALL_OF_FAME, rs.getString("username"));
            template.update(SQLQueries.INSERT_NEW_HALL_OF_FAME, username, submittedScore);
            return true;
        }

        //both didnt pass so return false
        return false;
    }

    public String getPersonalHighScore(String username){
        final SqlRowSet rs = template.queryForRowSet(SQLQueries.GET_USER_INFO, username);
        rs.next();

        //magic conversion by jdbc
        return rs.getString("score");
    }

    public String getUserPassword(String username) {
        final SqlRowSet rs = template.queryForRowSet(SQLQueries.GET_USER_INFO, username);
        rs.next();

        return rs.getString("password");
    }

    public boolean doesUsernameExist(String username) {
        final SqlRowSet rs = template.queryForRowSet(SQLQueries.CHECK_USERNAME_AVAILABILITY, username);
        int count = 0;

        rs.next();
        count = rs.getInt("count");

        if (count > 0) {
            return true;
        }

        return false;
    }

    // return hall of fame in linkedlist
    public LinkedList<String[]> getHallOfFame() {
        LinkedList<String[]> temp = new LinkedList<>();
        final SqlRowSet rs = template.queryForRowSet(SQLQueries.GET_HALL_OF_FAME);

        while (rs.next()) {
            temp.add(new String[] { rs.getString("username"), Integer.toString(rs.getInt("score")) });
        }

        return temp;
    }

    public void createNewUser(String username, String password){
        template.update(SQLQueries.INSERT_NEW_USERPW, username, password);
        template.update(SQLQueries.INSERT_NEW_USER_SCORE, username, 0);
    }
}
