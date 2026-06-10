package com.plantmanagement.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://plant-management-frontend-m7hg.onrender.com"
})
public class ChatController {

   @Value("${GROQ_API_KEY}")
private String apiKey;

    @PostMapping("/ask")
    public Map<String, String> ask(@RequestBody Map<String, String> body) {

        try {
            String question = body.get("question");
            if (question == null) question = "";

            String prompt = """
                    You are FloraBot, a friendly plant expert.
                    Answer clearly and give helpful plant suggestions.

                    User question:
                    """ + question;

            String json = """
            {
              "model": "llama-3.3-70b-versatile",
              "messages": [
                {
                  "role": "system",
                  "content": "You are FloraBot, a plant expert assistant."
                },
                {
                  "role": "user",
                  "content": "%s"
                }
              ]
            }
            """.formatted(prompt.replace("\"", "'").replace("\n", " ").replace("\r", " "));

            String url = "https://api.groq.com/openai/v1/chat/completions";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpClient client = HttpClient.newHttpClient();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            
            String answer = "AI error occurred.";
            if (root.has("choices") && root.get("choices").isArray() && root.get("choices").size() > 0) {
                answer = root.get("choices").get(0).get("message").get("content").asText();
            }

            return Map.of("answer", answer);

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("answer", "AI error occurred.");
        }
    }
}