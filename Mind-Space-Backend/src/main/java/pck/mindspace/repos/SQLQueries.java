package pck.mindspace.repos;

public class SQLQueries {

        public static final String GET_HALL_OF_FAME = """
                        SELECT username, score FROM hall_of_fame
                        ORDER BY
                        score DESC,
                        username ASC;
                        """;

        // get user info
        public static final String GET_USER_INFO = """
                        SELECT up.username as username, up.password as password, ps.score as score
                        FROM username_password as up
                        INNER JOIN personal_score as ps
                        on up.username = ps.username
                        WHERE up.username = ?;
                        """;

        public static final String INSERT_NEW_USERPW = """
                        INSERT INTO username_password values (?, ?);
                        """;

        public static final String INSERT_NEW_USER_SCORE = """
                        INSERT INTO personal_score values (?, ?);
                        """;

        public static final String CHECK_USERNAME_AVAILABILITY = """
                        SELECT COUNT(*) as count FROM username_password WHERE username = ?;
                        """;

        // The AS subquery is required because MySQL (and other SQL databases) needs to treat the result of the inner subquery 
        // as a temporary table from which the outer query can select
        public static final String DELETE_LOWEST_HALL_OF_FAME = """
                        DELETE FROM hall_of_fame WHERE score_id = (
                            SELECT min_score_id FROM (
                                SELECT score_id AS min_score_id
                                FROM hall_of_fame
                                WHERE username = ?
                                ORDER BY score ASC
                                LIMIT 1
                            ) AS subquery
                        );
                        """;

        public static final String UPDATE_PERSONAL_SCORE = """
                        UPDATE personal_score SET score = ? WHERE username = ?;
                        """;

        public static final String INSERT_NEW_HALL_OF_FAME = """
                        INSERT INTO hall_of_fame (username, score) values (?,?);
                        """;

        public static final String GET_LOWEST_HALL_OF_FAME = """
                        SELECT username, score FROM hall_of_fame
                        WHERE score = (SELECT MIN(score) FROM hall_of_fame)
                        ORDER BY username DESC;
                        """;

        public static final String GET_HALL_OF_FAME_SIZE = """
                        SELECT count(*) as count FROM hall_of_fame;
                        """;
}
