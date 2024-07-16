package pck.mindspace.repos;

import org.springframework.stereotype.Repository;

@Repository
public class SQLRepo {

    // TODO application properties revert back to env keys instead of hardcode
    // setup SQL
    public void setupSQL() {

    }

    // update personal high score (with check)
    public void updatePersonalHighScore(String username, double submittedScore) {

    }

    // update hall of fame in sql (with check)
    public void updateAllTimeHighScore(String username, double submittedScore) {

    }
}
