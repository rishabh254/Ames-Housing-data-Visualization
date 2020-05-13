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

##### Task 2.1-2.3 #####
@app.route('/get_eigen')
def get_eigen():
    eigen_orig = housing.get_eigenVs(df_orig)
    #eigen_random = housing.get_eigenVs(r_sample)
    #eigen_stratified = housing.get_eigenVs(s_sample)
    #data = {"eigen_orig": eigen_orig, "eigen_random": eigen_random, "eigen_stratified":eigen_stratified}
    data = {"eigen_orig": eigen_orig}
    return jsonify(data)

##### Task 3.1 #####
@app.route('/get_line_data')
def get_pcs():
    data = housing.get_line_data(df_orig)
    return (data)

##### Task 3.2 #####
@app.route('/get_mds/euclidean')
def get_mdsE():
    #mds_orig = housing.get_MDS(df_orig,distType)
    #mds_random = housing.get_MDS(r_sample,distType)
    #mds_stratified = housing.get_MDS(s_sample,distType)
    data = {"mds_orig": mds_origE, "mds_random": mds_randomE, "mds_stratified":mds_stratifiedE}
    return (data)

##### Task 3.2 #####
@app.route('/get_mds/correlation')
def get_mdsC():
    #mds_orig = housing.get_MDS(df_orig,distType)
    #mds_random = housing.get_MDS(r_sample,distType)
    #mds_stratified = housing.get_MDS(s_sample,distType)
    data = {"mds_orig": mds_origC, "mds_random": mds_randomC, "mds_stratified":mds_stratifiedC}
    return (data)

##### Task 3.3 #####
@app.route('/get_scatter_matrix_data')
def get_scatter_matrix_data():
    scatter_orig = housing.get_scatter_matrix_data(df_orig)
    scatter_random = housing.get_scatter_matrix_data(r_sample)
    scatter_stratified = housing.get_scatter_matrix_data(s_sample)
    data = {"scatter_orig": scatter_orig, "scatter_random": scatter_random, "scatter_stratified":scatter_stratified}
    return (data)

if __name__ == '__main__':
    df_orig = pd.read_csv('df_orig.csv')
    ##### Task 1.1 #####
    #r_sample = df_orig.sample(frac =.25, random_state=1)
    #r_sample = r_sample.reset_index(drop=True)
    #s_sample = df_orig.groupby('clusterNo').apply(lambda x: x.sample(frac=0.25,random_state=1))
    #s_sample = s_sample.reset_index(drop=True)
    #mds_origE = housing.get_MDS(df_orig,'euclidean')
    #mds_randomE = housing.get_MDS(r_sample,'euclidean')
    #mds_stratifiedE = housing.get_MDS(s_sample,'euclidean')
    #mds_origC = housing.get_MDS(df_orig,'correlation')
    #mds_randomC = housing.get_MDS(r_sample,'correlation')
    #mds_stratifiedC = housing.get_MDS(s_sample,'correlation')
    app.run(host='0.0.0.0',debug=True)
