package com.goofy.services;

import com.goofy.models.Departure;
import com.goofy.models.Departure.Message;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class DepartureServiceImplTest {
    private final DepartureService departureService = new DepartureServiceImpl();

    @Test
    public void filterByFutureDepartures_validDepartureWithinTimeRange_returnsFilteredDeparture() {
        // Arrange
        Message message = new Message();
        message.setStyle("");
        message.setInfoMessage("Some text");

        List<Message> messages = List.of(message);

        ZonedDateTime time = ZonedDateTime.now(ZoneId.of("Europe/Paris")).plusMinutes(15);
        String formatTime = time.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX"));

        Departure departure = new Departure();
        departure.setDirection("Some direction");
        departure.setName("Some name");
        departure.setActualTrack("Some track");
        departure.setPlannedDateTime(formatTime);
        departure.setMessages(messages);

        Departure departure2 = new Departure();
        departure2.setDirection("Some direction");
        departure2.setName("Some name");
        departure2.setActualTrack("Some track");
        departure2.setPlannedDateTime(formatTime);
        departure2.setMessages(messages);

        List<Departure> departures = List.of(departure, departure2);

        // Act
        List<Departure> result = departureService.filterByFutureDepartures(departures);

        // Assert
        assertEquals(2, result.size());
        assertEquals(departure, result.get(0));
        assertEquals(departure2, result.get(1));
    }

    @Test
    public void filterByFutureDepartures_departureOutsideTimeRange_returnsEmptyList() {
        // Arrange
        Message message = new Message();
        message.setStyle("");
        message.setInfoMessage("Some text");

        List<Message> messages = List.of(message);

        ZonedDateTime time = ZonedDateTime.now(ZoneId.of("Europe/Paris")).plusMinutes(55);
        String formatTime = time.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX"));

        Departure departure = new Departure();
        departure.setDirection("Some direction");
        departure.setName("Some name");
        departure.setActualTrack("Some track");
        departure.setPlannedDateTime(formatTime);
        departure.setMessages(messages);// Within the time range

        Departure departure2 = new Departure();
        departure2.setDirection("Some direction");
        departure2.setName("Some name");
        departure2.setActualTrack("Some track");
        departure2.setPlannedDateTime(formatTime);
        departure2.setMessages(messages);// Within the time range

        List<Departure> departures = List.of(departure, departure2);

        // Act
        List<Departure> result = departureService.filterByFutureDepartures(departures);

        // Assert
        assertEquals(0, result.size());
    }

    @Test
    public void filterByFutureDepartures_departureWithWarningMessage_returnsEmptyList() {
        // Arrange
        Message message = new Message();
        message.setStyle("WARNING");
        message.setInfoMessage("Some text");

        List<Message> messages = List.of(message);

        ZonedDateTime time = ZonedDateTime.now(ZoneId.of("Europe/Paris")).plusMinutes(15);
        String formatTime = time.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX"));

        Departure departure = new Departure();
        departure.setDirection("Some direction");
        departure.setName("Some name");
        departure.setActualTrack("Some track");
        departure.setPlannedDateTime(formatTime);
        departure.setMessages(messages);

        Departure departure2 = new Departure();
        departure2.setDirection("Some direction");
        departure2.setName("Some name");
        departure2.setActualTrack("Some track");
        departure2.setPlannedDateTime(formatTime);
        departure2.setMessages(messages);

        List<Departure> departures = List.of(departure, departure2);

        // Act
        List<Departure> result = departureService.filterByFutureDepartures(departures);

        // Assert
        assertEquals(0, result.size());
    }

    @Test
    public void filterByFutureDepartures_departuresNull_returnsEmptyList() {
        // Act
        List<Departure> result = departureService.filterByFutureDepartures(null);

        // Assert
        assertEquals(0, result.size());
    }
}
