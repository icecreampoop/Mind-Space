package pck.mindspace.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import pck.mindspace.models.UserModel;
import pck.mindspace.services.DBService;

@Controller
public class BackendController {

    @Autowired
    DBService dbService;
    
    //query string
    @GetMapping("/api/scores")
    public ResponseEntity<?> getScores(@RequestParam String score) {

        return;
    }

    @PostMapping("/api/login")
    public ResponseEntity<?> userLogin(
        @RequestBody(required = true) UserModel user, BindingResult result) {

        return;
    }

    @PostMapping("/api/create-new-account")
    public ResponseEntity<?> createNewAccount(
        UserModel user,
        BindingResult result
    ) {
        if (result.hasErrors()){
            //return error response, shouldn't happen through the app though
            //since frontend also doing validation already

        }
        //call censorship api

        return;
    }

    //parameterized route
    @PutMapping("/api/{username}/update-score")
    public ResponseEntity<?> updateUserHighScore() {

        return;
    }
}
