package pck.mindspace.repos;

public class Queries {

    // create sql db if it doesnt exist
    public static final String CREATE_SQL_DB = """
            CREATE DATABASE IF NOT EXISTS `mindspace_sql_db`;
            USE `mindspace_sql_db`;

            CREATE TABLE IF NOT EXISTS `username_password` (
                `username` varchar(32) NOT NULL,
                `password` varchar(32) NOT NULL,
                PRIMARY KEY (`username`),
                CONSTRAINT `fk_personal_score` FOREIGN KEY (`username`) REFERENCES `personal_score`(`username`),
                CONSTRAINT `fk_all_time_score` FOREIGN KEY (`username`) REFERENCES `all_time_score`(`username`)
                )
            
            CREATE TABLE IF NOT EXISTS `personal_score` (
                `username` varchar(32) NOT NULL,
                `score` varchar(32) NOT NULL,
                `score_id` int AUTO_INCREMENT,
                PRIMARY KEY (`score_id`)
                )
                """;
}
