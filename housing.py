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
def preprocess(df,norm):
    cols = ['YrSold','SalePrice','YearRemodAdd','MoSold','ExterQual','KitchenQual','OverallQual',
            'FireplaceQu','BsmtQual','BsmtFinSF1','GrLivArea','GarageArea','LotArea', 'Neighborhood']
    df = df[cols]

    df = df[:750]
    # features rated as Ex, Gd, TA, Fa, Po
    feature_rated =['ExterQual','ExterCond','BsmtQual','BsmtCond','BsmtExposure',
                'HeatingQC','KitchenQual','FireplaceQu','GarageQual']

    train_encoded = df.copy()
    train_encoded.fillna(train_encoded.mean(),inplace=True)
    # Add only in case of df_orig
    if(norm ==0):
        train_encoded['NeighborhoodText'] = train_encoded['Neighborhood']

    for feature in train_encoded:
        # label encoding categorical features
        if feature == 'NeighborhoodText':
            continue;
        if train_encoded[feature].dtype=='object':
            # manual encoding to maintain original value of these features
            if feature in feature_rated:
                train_encoded[feature] = train_encoded[feature].map({'Ex': 5,
                                                               'Gd': 4, 
                                                               'TA': 3,
                                                               'Fa': 2, 
                                                               'Po': 1}).fillna(2)
            # otherwise use label encoder
            else:
                lbl = preprocessing.LabelEncoder()
                lbl.fit(list(train_encoded[feature].values))
                train_encoded[feature] = lbl.transform(list(train_encoded[feature].values))
        #train_encoded = train_encoded[train_encoded[feature].between(train_encoded[feature].quantile(.01), train_encoded[feature].quantile(.99))]
        if norm == 1:
                mn = min(train_encoded[feature])
                mx = max(train_encoded[feature])
                train_encoded[feature] = (train_encoded[feature]-mn)/(mx-mn)
                #print(len(train_encoded))
    train_encoded.fillna(train_encoded.mean(),inplace=True)
    return train_encoded


def get_line_data(data):
    df = data[['SalePrice','YrSold','YearRemodAdd','OverallQual']]
    df['age'] = df['YrSold'] - df['YearRemodAdd']
    df = df.drop(columns=['YrSold','YearRemodAdd'])
    df = df.groupby(['age']).mean().reset_index()
    df = df[df['age']>=0]
    return df.to_json(orient='records')

def get_MDS(df_norm,df_orig):
    no_cols = len(df_norm.columns)
    '''dd = data.T.corr()
    vv = data.corr()
    vd=[]

    for col in data.columns:
        v_df = (pd.DataFrame(0, index=np.arange(len(data)), columns=data.columns))
        v_df[col]=1
        vd.append(data.corrwith(v_df, axis=1))
    dv = np.array(vd).T
    cm = np.concatenate((np.concatenate((dd,dv),1), np.concatenate((vd,vv),1)),0)
    print(len(cm))'''
    embedding = MDS(n_init=1 , n_components=2, dissimilarity = 'precomputed', random_state=1)
    X_transformed = embedding.fit_transform(pow(2*(1-df_norm.T.corr()),0.5))
    X_transformed1 = embedding.fit_transform(pow(2*(1-df_norm.corr()),0.5))
    
    mds_df = pd.DataFrame(np.concatenate((X_transformed,X_transformed1),0), columns=['dim0','dim1'])
    # datatype 0 : datapoint , 1 : feature
    mds_df['dataType'] = 0
    mds_df['label'] = ""
    for i in range(len(df_norm.columns)):
        mds_df.loc[len(mds_df)-i-1,'label'] = df_norm.columns[no_cols-i-1]
    mds_df.loc[len(mds_df)-no_cols:,'dataType']=1

    for col in df_norm.columns:
        mds_df[col] = df_norm[col]
        mds_df[col+'1'] = df_orig[col]
        mds_df.loc[len(mds_df)-no_cols:,col]=1
    mds_df['NeighborhoodText'] = df_orig['NeighborhoodText'];
    mds_df['score'] = 0
    return mds_df.to_json(orient='records')


##### main #####
if __name__ == "__main__":
    df = pd.read_csv('housing.csv')
    df_encoded = preprocess(df,0)
    df_orig = preprocess(df,0)
    df_norm = preprocess(df,1)

    df_orig.to_csv('df_orig.csv',index=False)
    df_norm.to_csv('df_norm.csv',index=False)
    
    
