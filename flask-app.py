from flask import Flask, request, jsonify
from flask import send_file
from flask import render_template
import housing
import base64
import json
import pandas as pd

app = Flask(__name__)

@app.route("/")
@app.route("/home")
def home():
    return "<h1>Home Page</h1>"


@app.route('/<name>')
def get_html(name):
    return render_template(name+'.html', name=name)

@app.route('/get_line_data')
def get_pcs():
    data = housing.get_line_data(df_orig)
    print("linr....")
    print(data)
    return (data)

@app.route('/get_mds')
def get_mdsE():
    data = {"mds_orig": mds_origE}
    return (data)

if __name__ == '__main__':
    df_orig = pd.read_csv('df_orig.csv')
    df_norm = pd.read_csv('df_norm.csv')
    mds_origE = housing.get_MDS(df_norm,df_orig,'euclidean')
    app.run(host='0.0.0.0',debug=True)
