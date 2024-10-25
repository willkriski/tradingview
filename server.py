#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS
import yfinance as yf
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/stock/<symbol>')
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=365)
        data = stock.history(start=start_date, end=end_date)
        return jsonify(data.reset_index().to_dict('records'))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stock/<symbol>/latest')
def get_latest_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=1)
        data = stock.history(start=start_date, end=end_date)
        if not data.empty:
            latest = data.iloc[-1]
            return jsonify({
                'price': latest['Close'],
                'change': ((latest['Close'] - latest['Open']) / latest['Open'] * 100).round(2)
            })
        return jsonify({'error': 'No data available'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
