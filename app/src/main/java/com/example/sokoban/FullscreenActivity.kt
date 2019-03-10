package com.example.sokoban

import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import android.webkit.WebView
import android.view.MotionEvent
import android.view.View.OnTouchListener

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 */
class FullscreenActivity : AppCompatActivity() {
    private lateinit var adViewNorth : AdView
    private lateinit var adViewSouth : AdView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_fullscreen)
        supportActionBar?.hide()

        // Sample AdMob app ID: ca-app-pub-3940256099942544~3347511713
        MobileAds.initialize(this, "ca-app-pub-3940256099942544~3347511713")

        val adRequest = AdRequest.Builder().build()
        adViewNorth = findViewById(R.id.adViewNorth)
        adViewNorth.loadAd(adRequest)
        adViewSouth = findViewById(R.id.adViewSouth)
        adViewSouth.loadAd(adRequest)

        val webView = findViewById<WebView>(R.id.webView)
        webView.settings.javaScriptEnabled = true
        webView.loadUrl("file:///android_asset/index.html")
        webView.setOnTouchListener { view, motionEvent ->
            (motionEvent.getAction() == MotionEvent.ACTION_MOVE)
        }
    }
}
