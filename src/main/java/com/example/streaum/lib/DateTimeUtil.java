package com.example.streaum.lib;

import com.example.streaum.entity.InvitationExpireTimePeriod;

import java.util.Date;

public class DateTimeUtil {
    public static String getDateTime() {
        return java.time.LocalDateTime.now().toString();
    }
    public static String getDate() {
        return java.time.LocalDate.now().toString();
    }
    public  static String getTime() {
        return java.time.LocalTime.now().toString();
    }

    public static Date expandDateByInvitationExpireTimePeriod(InvitationExpireTimePeriod period){
        switch (period) {
            case ONEHOUR:
                return new Date(System.currentTimeMillis() + 60 * 60 * 1000);
            case ONEDAY:
                return new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000);
            case ONEWEEK:
                return new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000);
            default:
                return null;
        }
    }

}
