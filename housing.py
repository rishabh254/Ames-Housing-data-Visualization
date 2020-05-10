'''
Created Date: Feb 26, 2020
Author: Rishabh Goel

CSE564 Spring 2020:- Mini Project-2
'''

import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
from sklearn.cluster import KMeans
from sklearn import preprocessing
from sklearn.preprocessing import LabelEncoder
from scipy import stats
from sklearn.decomposition import PCA
import math
import random

from sklearn.manifold import MDS

##### Task 0 #####
def preprocess(df):
    cols = ['YrSold','MoSold','ExterQual','KitchenQual','OverallQual',
            'FireplaceQu','BsmtQual','BsmtFinSF1','GrLivArea','GarageArea','LotArea']
    df = df[cols]
    df = df[:750]
    # features rated as Ex, Gd, TA, Fa, Po
    feature_rated =['ExterQual','ExterCond','BsmtQual','BsmtCond','BsmtExposure',
                'HeatingQC','KitchenQual','FireplaceQu','GarageQual']

    train_encoded = df.copy()
    train_encoded.fillna(train_encoded.mean(),inplace=True)

    for feature in train_encoded:
        # label encoding categorical features
        if train_encoded[feature].dtype=='object':
            # manual encoding to maintain original value of these features
            if feature in feature_rated:
                train_encoded[feature] = train_encoded[feature].map({'Ex': 4,
                                                               'Gd': 3, 
                                                               'TA': 2,
                                                               'Fa': 1, 
                                                               'Po': 0}).fillna(-1)
            # otherwise use label encoder
            else:
                lbl = preprocessing.LabelEncoder()
                lbl.fit(list(train_encoded[feature].values))
                train_encoded[feature] = lbl.transform(list(train_encoded[feature].values))
        else:
            #pass
            train_encoded[feature] = stats.zscore(train_encoded[feature])
    train_encoded.fillna(train_encoded.mean(),inplace=True)
    return train_encoded

##### Task 1.2 #####
def kmeans_elbow(df):
    wcss = []
    for i in range(1, 11):
        kmeans = KMeans(n_clusters=i, init='k-means++', max_iter=300, n_init=10, random_state=0)
        kmeans.fit(df)
        wcss.append(kmeans.inertia_)
    plt.plot(range(1, 11), wcss,marker='x')
    plt.title('Elbow Method')
    plt.xlabel('Number of clusters')
    plt.ylabel('WCSS')
    plt.xticks(np.arange(0, 11, step=1))
    plt.show()

##### Task 2.1-2.3 #####
def get_eigenVs(data):
    df = data.drop(columns=['clusterNo'])
    pca = PCA().fit(df)
    cum_eigen = np.cumsum(pca.explained_variance_ratio_)
    eigen =[]
    eigen.append(cum_eigen[0])
    for i in range(1,len(cum_eigen)):
        eigen.append(cum_eigen[i]-cum_eigen[i-1])
    json_data=[]
    for i in range(0,len(eigen)):
        json_data.append({"eigen":eigen[i]*100,
                          "cum_eigen":cum_eigen[i]*100,
                          "index":i+1})
    return np.array(json_data).tolist()

##### Task 2.4 #####
def get_loading_attrs(data):    
    pca = PCA(n_components=3)
    principalComponents = pca.fit_transform(data)

    pCs_df = pd.DataFrame(pca.components_.T
             , columns = ['PC 1', 'PC 2', 'PC 3'], index=data.columns)
    return (np.square(pCs_df).sum(axis=1).sort_values(ascending=False)[:3])

##### Task 3.1 #####
def get_PCS(data):
    pca = PCA(n_components=2, random_state=0)
    principalComponents = pca.fit_transform(data)
    PCA_DF = pd.DataFrame(principalComponents)

    PCA_DF['clusterNo'] = data['clusterNo']
    return PCA_DF.to_json(orient='records')

##### Task 3.2 #####
def get_MDS(data,distType):
    if distType is 'euclidean':
        embedding = MDS(n_init=1, n_components=2, dissimilarity = distType, random_state=1)
        X_transformed = embedding.fit_transform(data)
    else:
        embedding = MDS(n_init=1 , n_components=2, dissimilarity = 'precomputed', random_state=1)
        X_transformed = embedding.fit_transform(pow(2*(1-data.T.corr()),0.5))

    mds_df = pd.DataFrame(X_transformed, columns=['dim0','dim1'])
    mds_df['clusterNo'] = data['clusterNo'].astype(int)
    return mds_df.to_json(orient='records')

##### Task 3.3 #####
def get_scatter_matrix_data(data):
    top_3_attrs = get_loading_attrs(data)
    cols=[]
    for index, val in top_3_attrs.iteritems():
        cols.append(index)
    cols.append('clusterNo')
    data = data[cols]
    return data.to_json(orient='records')

##### main #####
if __name__ == "__main__":
    df = pd.read_csv('housing.csv')

    df_encoded = preprocess(df)
    
    print(len(df_encoded))
    
    kmeans_elbow(df_encoded)
    no_clusters = 3

    kmeans = KMeans(n_clusters=no_clusters, init='k-means++', max_iter=300, n_init=10, random_state=0)
    kmeans.fit(df_encoded)
    labels = kmeans.labels_

    #Glue back to originaal data
    df_encoded['clusterNo'] = labels
    df_encoded.to_csv('df_orig.csv',index=False)
    
    
