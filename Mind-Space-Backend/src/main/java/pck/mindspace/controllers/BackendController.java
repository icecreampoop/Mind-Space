package pck.mindspace.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

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
    public ResponseEntity<?> userLogin(
            @RequestBody(required = true) UserModel user, BindingResult result) {

        // username does not exist
        if (false) {

        } else if (false) {
            // wrong password

        }

        // return user personal best score
        return new ResponseEntity<String>("Login Successful", HttpStatus.OK);
    }

    @PostMapping(value = "/create-new-account", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createNewAccount(
            UserModel user,
            BindingResult result) {
        if (result.hasErrors()) {
            // return error response, shouldn't happen through the app though unless call
            // api straight
            // since frontend also doing validation already

        }
        // call censorship api with resttemplate

        return new ResponseEntity<String>("Account Created!", HttpStatus.CREATED);
    }

    // parameterized route
    @PutMapping("/{username}/update-score")
    public ResponseEntity<?> updateUserHighScore(@PathVariable String username, @RequestBody String score) {
        boolean newHighScore = false;

        // new personal best score?
        if (false) {
            newHighScore = true;
        }
        // new daily rank?
        if (false) {
            newHighScore = true;
        }
        // new hall of fame?
        if (false) {
            newHighScore = true;
        }

        if (newHighScore) {
            return new ResponseEntity<String>("High Score Updated", HttpStatus.OK);
        }

        return new ResponseEntity<String>("Try Harder Noob", HttpStatus.OK);
    }
}
