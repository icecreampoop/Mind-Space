package pck.mindspace.models;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UserModel {
    @NotNull(message = "Username cannot be empty")
    @Size(min=5, max=32, message = "Please ensure username is between 5-32 characters")
    private String username;

    @NotNull(message = "Password cannot be empty")
    @Size(min=5, max=32, message = "Please ensure password is between 5-32 characters")
    private String password;

    private int highscore = 0;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getHighscore() {
        return highscore;
    }

    public void setHighscore(int highscore) {
        this.highscore = highscore;
    }

}
