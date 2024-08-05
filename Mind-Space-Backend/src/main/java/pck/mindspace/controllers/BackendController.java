package pck.mindspace.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import jakarta.json.JsonArray;
import pck.mindspace.models.UserModel;
import pck.mindspace.services.DBService;
import pck.mindspace.utils.LinkedListToJsonUtil;

@Controller()
@RequestMapping("/api")
public class BackendController {

    @Autowired
    DBService dbService;

    // query string
    @GetMapping("/scores")
    public ResponseEntity<?> getScores(@RequestParam String score) {
        if (score.equals("dailyscores")) {

            return new ResponseEntity<JsonArray>(
                    LinkedListToJsonUtil.convert(dbService.getHighScoreOfTheDay()),
                    HttpStatus.OK);

        } else if (score.equals("halloffame")) {

            return new ResponseEntity<JsonArray>(
                    LinkedListToJsonUtil.convert(dbService.getHallOfFame()),
                    HttpStatus.OK);
        }

        return new ResponseEntity<String>("Wrong Score Parameters", HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> userLogin(
            @RequestBody(required = true) UserModel user, BindingResult result) {

        // if someone notti call api straight without using frontend
        if (result.hasErrors()) {
            String response = "";
            for (FieldError error : result.getFieldErrors()) {
                response = response + error.getDefaultMessage();
            }

            return new ResponseEntity<String>(response, HttpStatus.BAD_REQUEST);
        }

        // 0 for wrong username
        if (dbService.loginCheck(user.getUsername(), user.getPassword()) == 0) {
            return new ResponseEntity<String>("Username Does Not Exist", HttpStatus.BAD_REQUEST);

        } else if (dbService.loginCheck(user.getUsername(), user.getPassword()) == 1) {
            // 1 for wrong password
            return new ResponseEntity<String>("Wrong Password", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<String>(dbService.getUserPersonalHighScore(user.getUsername()), HttpStatus.OK);
    }

    @PostMapping(value = "/create-new-account", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createNewAccount(
        @RequestBody(required = true) UserModel user,
        BindingResult result) {
        if (result.hasErrors()) {
            // return error response, shouldn't happen through the app though unless call
            // api straight
            // since frontend also doing validation already
            String response = "";
            for (FieldError error : result.getFieldErrors()) {
                response = response + error.getDefaultMessage();
            }

            return new ResponseEntity<String>(response, HttpStatus.BAD_REQUEST);
        }

        // profanity filter, calling external restful api
        RestTemplate template = new RestTemplate();
        if (template.getForObject("https://www.purgomalum.com/service/containsprofanity?text=" + user.getUsername(), String.class).equals("true")){
            return new ResponseEntity<String>("Username contains profanity: " + template.getForObject("https://www.purgomalum.com/service/plain?text=" + user.getUsername(), String.class), HttpStatus.BAD_REQUEST);
        }

        // check username availability
        if (!dbService.getUsernameAvailability(user.getUsername())) {
            return new ResponseEntity<String>("Username is taken", HttpStatus.BAD_REQUEST);
        }

        dbService.createAccount(user.getUsername(), user.getPassword());

        return new ResponseEntity<String>("Account Created!", HttpStatus.CREATED);
    }

    // parameterized route
    @PutMapping("/{username}/update-score")
    public ResponseEntity<String> updateUserHighScore(@PathVariable String username, @RequestBody(required = true) String score) {
        int newHighScore = 0;

        // update personal best
        dbService.updatePersonalHighScore(username, Double.parseDouble(score));

        // new daily rank?
        if (dbService.updateRedisHighScore(username, Double.parseDouble(score))) {
            newHighScore = 1;
        }
        // new hall of fame?
        if (dbService.updateHallOfFame(username, Double.parseDouble(score))) {
            newHighScore = 2;
        }

        //after dbs updated return response, structured to favor new hall of fame
        if (newHighScore == 1) {
            return new ResponseEntity<String>("Daily Rank Updated", HttpStatus.OK);
        } else if (newHighScore == 2) {
            return new ResponseEntity<String>("Hall Of Fame Updated", HttpStatus.OK);
        }

        return new ResponseEntity<String>("Personal High Score Updated", HttpStatus.OK);
    }
}
