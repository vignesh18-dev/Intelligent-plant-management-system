package com.plantmanagement.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.net.http.*;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/plant")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://plant-management-frontend-m7hg.onrender.com"
})
public class PlantScanController {

    private static final Logger log = LoggerFactory.getLogger(PlantScanController.class);

    @Value("${GROQ_API_KEY}")
private String apiKey;

    @PostMapping("/scan")
    public Map<String, String> scanPlant(@RequestParam("file") MultipartFile file) {

        try {
            // Convert image → Base64
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            String prompt =
    "You are FloraBot, an expert plant identification AI. " +
    "Identify this plant and provide: " +
    "Plant name, Sunlight needs, Watering needs, Difficulty level, " +
    "Common diseases, and Tips to grow it better.";

    prompt = prompt.replace("\n", " ")
               .replace("\r", " ")
               .replace("\"", "\\\"");
           String json = """
{
  "model": "llama-3.2-11b-vision-preview",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "%s"
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,%s"
          }
        }
      ]
    }
  ]
}
""".formatted(prompt.replace("\"", "'"), base64Image);

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

            log.info("Groq Vision API response status: {}", response.statusCode());

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());

            String answer = "AI image scan error.";
            if (root.has("choices") && root.get("choices").isArray() && root.get("choices").size() > 0) {
                answer = root.get("choices").get(0).get("message").get("content").asText();
            } else {
                log.error("Groq Vision API returned unexpected response: {}", response.body());
            }

            return Map.of("answer", answer);

        } catch (Exception e) {
            log.error("Error during plant scan", e);
            return Map.of("answer", "AI image scan error.");
        }
    }
}
