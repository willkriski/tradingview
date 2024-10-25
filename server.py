#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
import requests
from datetime import datetime, timedelta
import logging
import traceback
import json
import os
from constants import ALPHA_VANTAGE_API_KEY

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

ALL_STOCKS = []
CACHE_FILE = 'stock_cache.json'
CACHE_DURATION = timedelta(days=30)

def load_cached_stocks():
    global ALL_STOCKS
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            cache_data = json.load(f)
            cache_time = datetime.fromisoformat(cache_data['timestamp'])
            if datetime.now() - cache_time < CACHE_DURATION:
                ALL_STOCKS = cache_data['stocks']
                logging.info(f"Loaded {len(ALL_STOCKS)} stocks from cache")
                return True
    return False

def save_stocks_to_cache():
    cache_data = {
        'timestamp': datetime.now().isoformat(),
        'stocks': ALL_STOCKS
    }
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache_data, f)
    logging.info(f"Saved {len(ALL_STOCKS)} stocks to cache")

def fetch_all_stocks():
    global ALL_STOCKS
    if load_cached_stocks():
        return

    try:
        url = f'https://www.alphavantage.co/query?function=LISTING_STATUS&apikey={ALPHA_VANTAGE_API_KEY}'
        response = requests.get(url)
        if response.status_code == 200:
            lines = response.text.strip().split('\n')
            headers = lines[0].split(',')
            ALL_STOCKS = []
            for line in lines[1:]:
                values = line.split(',')
                stock = dict(zip(headers, values))
                ALL_STOCKS.append({
                    'symbol': stock['symbol'],
                    'name': stock['name'],
                    'exchange': stock['exchange']
                })
            logging.info(f"Fetched {len(ALL_STOCKS)} stocks from API")
            save_stocks_to_cache()
        else:
            logging.error(f"Failed to fetch stocks: {response.status_code}")
    except Exception as e:
        logging.exception("An error occurred while fetching all stocks")

@app.route('/stock/<symbol>')
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        data = stock.history(start=start_date, end=end_date)
        return jsonify(data.reset_index().to_dict('records'))
    except Exception as e:
        logging.exception(f"Error fetching stock data for {symbol}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/stocks', methods=['GET'])
def get_stocks():
    return jsonify(ALL_STOCKS)

if __name__ == '__main__':
    fetch_all_stocks()  # Prefetch all stocks when the server starts
    app.run(host='0.0.0.0', port=5001, debug=True)
