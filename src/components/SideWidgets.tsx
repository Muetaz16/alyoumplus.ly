"use client";

import { useEffect, useState } from "react";
import db from "@/lib/db";
import styles from "./SideWidgets.module.css";

interface WeatherData {
  temperature: number;
  weathercode: number;
  humidity?: number;
  windSpeed?: number;
}

export default function SideWidgets() {
  const [exchangeRates, setExchangeRates] = useState<{ usd: string; eur: string; gbp: string } | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Fetch Settings for Exchange Rates
    async function fetchSettings() {
      try {
        const settings = await db.contactSetting.findFirst();
        if (settings) {
          setExchangeRates({
            usd: settings.exchangeUsd || "7.15",
            eur: settings.exchangeEur || "7.75",
            gbp: settings.exchangeGbp || "9.05",
          });
        } else {
          setExchangeRates({ usd: "7.15", eur: "7.75", gbp: "9.05" });
        }
      } catch (err) {
        console.error("Failed to load exchange rates", err);
      }
    }
    fetchSettings();

    // Fetch Weather (Benghazi coordinates: 32.1167, 20.0667)
    async function fetchWeather() {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=32.1167&longitude=20.0667&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code");
        const data = await res.json();
        setWeather({
          temperature: data.current.temperature_2m,
          weathercode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
        });
      } catch (err) {
        console.error("Failed to fetch weather", err);
      }
    }
    fetchWeather();
  }, []);

  // Map weather code to emoji (WMO Weather interpretation codes)
  const getWeatherIcon = (code: number) => {
    if (code === 0) return "☀️"; // Clear
    if (code === 1 || code === 2 || code === 3) return "⛅"; // Partly cloudy
    if (code >= 45 && code <= 48) return "🌫️"; // Fog
    if (code >= 51 && code <= 67) return "🌧️"; // Rain/Drizzle
    if (code >= 71 && code <= 77) return "❄️"; // Snow
    if (code >= 80 && code <= 82) return "🌦️"; // Showers
    if (code >= 95) return "⛈️"; // Thunderstorm
    return "🌤️";
  };

  return (
    <div className={styles.widgetsContainer}>
      
      {/* Weather Inline Card */}
      <div className={styles.widgetCard}>
        <div className={styles.weatherHeader}>
          <h3 className={styles.widgetTitle}>الطقس الآن</h3>
          <span className={styles.weatherCity}>بنغازي</span>
        </div>
        <div className={styles.weatherMain}>
          <div className={styles.weatherTempWrapper}>
            <span className={styles.weatherIcon}>
              {weather ? getWeatherIcon(weather.weathercode) : "🌤️"}
            </span>
            <span className={styles.weatherTemp}>
              {weather ? `${Math.round(weather.temperature)}°` : "--°"}
            </span>
          </div>
          <div className={styles.weatherExtra}>
            <div className={styles.extraItem} title="سرعة الرياح">
              <span>💨</span>
              <span>{weather?.windSpeed ? Math.round(weather.windSpeed) : "-"} كم/س</span>
            </div>
            <div className={styles.extraItem} title="الرطوبة">
              <span>💧</span>
              <span>{weather?.humidity ? weather.humidity : "-"}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exchange Rates Inline Card */}
      <div className={styles.widgetCard}>
        <h3 className={styles.widgetTitle}>أسعار الصرف (موازي)</h3>
        <div className={styles.ratesList}>
          <div className={styles.rateRow}>
            <div className={styles.currencyFlag}>
              <span>🇺🇸</span> USD
            </div>
            <div className={styles.currencyValue}>
              {exchangeRates?.usd || "---"} <span className={styles.lydSymbol}>د.ل</span>
            </div>
          </div>
          <div className={styles.rateRow}>
            <div className={styles.currencyFlag}>
              <span>🇪🇺</span> EUR
            </div>
            <div className={styles.currencyValue}>
              {exchangeRates?.eur || "---"} <span className={styles.lydSymbol}>د.ل</span>
            </div>
          </div>
          <div className={styles.rateRow}>
            <div className={styles.currencyFlag}>
              <span>🇬🇧</span> GBP
            </div>
            <div className={styles.currencyValue}>
              {exchangeRates?.gbp || "---"} <span className={styles.lydSymbol}>د.ل</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
