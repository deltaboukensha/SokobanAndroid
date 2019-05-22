package com.example.sokoban

import android.annotation.SuppressLint
import android.os.Bundle
import android.support.v7.app.AppCompatActivity
import android.view.MotionEvent
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.MobileAds
import java.io.ByteArrayInputStream
import java.net.ServerSocket
import java.nio.charset.Charset

/**
 * An example full-screen activity that shows and hides the system UI (i.e.
 * status bar and navigation/system bar) with user interaction.
 */
class FullscreenActivity : AppCompatActivity() {
    private lateinit var adBanner : AdView
    private lateinit var serverSocket: ServerSocket

    @SuppressLint("ClickableViewAccessibility", "SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        System.out.println("onCreate")
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_fullscreen)
        supportActionBar?.hide()

        // Sample AdMob app ID: ca-app-pub-3940256099942544~3347511713
        MobileAds.initialize(this, "ca-app-pub-3940256099942544~3347511713")

        val adRequest = AdRequest.Builder().build()
        adBanner = findViewById(R.id.adBanner)
        adBanner.loadAd(adRequest)

        val webView = findViewById<WebView>(R.id.webView)
        webView.settings.javaScriptEnabled = true

        val apply = webView.settings.apply {
            allowFileAccess = true
            allowContentAccess = true
        }

        webView.webViewClient = MyWebViewClient()

        webView.loadUrl("http://localhost/index.html")
        webView.setOnTouchListener { _, motionEvent ->
            motionEvent.action == MotionEvent.ACTION_MOVE
        }
    }
}

class MyWebViewClient : WebViewClient(){
    override fun shouldInterceptRequest(view: WebView?, request: WebResourceRequest?): WebResourceResponse {
        System.out.println("REQUEST")
        System.out.println(request?.url)
        var dataStream = ByteArrayInputStream("Hello World".toByteArray(Charset.defaultCharset()))
        return WebResourceResponse("text/plain", "UTF-8", dataStream)
    }
}