package pck.mindspace.utils;

import java.util.LinkedList;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;

public class LinkedListToJsonUtil {
    
    public static JsonArray convert(LinkedList<String[]> list){
        JsonArrayBuilder jsonArrBuilder = Json.createArrayBuilder();

        //0 username, 1 score
        for (String[] x : list) {
            jsonArrBuilder.add(
                Json.createObjectBuilder().add("name", x[0]).add("score", x[1]).build()
            );
        }

        return jsonArrBuilder.build();
    }
}
