package com.fieldbook.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

/** Woken by the dispatch system's push relay: marks the day's jobs for a refresh, or reassigns the phone. */
public class JobSyncReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPreferences prefs = context.getSharedPreferences("CapacitorStorage", Context.MODE_PRIVATE);
        SharedPreferences.Editor edit = prefs.edit().putString("fieldbook.refresh", "true");
        String technician = intent.getStringExtra("token");
        if (technician != null) edit.putString("fieldbook.token", technician);
        edit.apply();
    }
}
