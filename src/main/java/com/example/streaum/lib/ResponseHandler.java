package com.example.streaum.lib;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class ResponseHandler {

    /**
     * Writes a JSON response to the client.
     *
     * <p>Sets the HTTP status, adds a {@code "success"} flag to the provided JSON payload,
     * serializes it with Gson, sets the {@code application/json} content type,
     * and writes the result to the response output.</p>
     *
     * <p><b>Side effects:</b></p>
     * <ul>
     *   <li>Mutates {@code responseObject} by adding a {@code "success"} property.</li>
     *   <li>Commits the response status, headers, and body.</li>
     * </ul>
     * <p>
     *  * @param response        the HTTP servlet response to write to; must not be {@code null}
     *  * @param responseStatus  the HTTP status code to set (for example, 200, 400, 500)
     *  * @param isSuccess       the value for the {@code "success"} property in the payload
     *  * @param responseObject  the JSON object to send; must not be {@code null}
     *  * @throws IOException if an I/O error occurs while writing to the response
     */
    public static void SendResponseJson(HttpServletResponse response, int responseStatus, boolean isSuccess, JsonObject responseObject) throws IOException {
        Gson gson = new Gson();

        response.setStatus(responseStatus);
        responseObject.addProperty("success", isSuccess);
        String responseText = gson.toJson(responseObject);
        response.setContentType("application/json");
        response.getWriter().write(responseText);

    }
}
