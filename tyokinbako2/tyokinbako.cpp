#include <iostream>
#include <fstream>
#include <opencv2/opencv.hpp>
#include <opencv2/nonfree/nonfree.hpp>
#include <opencv2/legacy/legacy.hpp>//BruteForceMatcheに必要。opencv2.4で移動した？
#pragma comment(lib,"opencv_nonfree242.lib")

using namespace std;
const int B = 0;
const int G = 1;
const int R = 2;

int calcMatSum(cv::Mat mat){
	int sum = 0;
	for(int row = 0; row < mat.rows; row++){
		for(int col = 0; col < mat.cols; col++){
			cv::Vec3b vec = mat.at<cv::Vec3b>(row, col);
			for(int i = 0; i < 3; i++){
				sum += vec[i];
			}
		}
	}
	return sum;
}



int main(){
	ifstream ifs;
	ifs.open("selectArea.csv");
	string str;
	vector<int> values;
	// if( !ifs ) {cout << "Error:Input data file not found" << endl;　return; }
 	while( getline( ifs, str ) ){
		string token;
		stringstream ss, ss2;
		istringstream stream( str );
 
		while( getline( stream, token, ',' ) ) {
			
			values.push_back( atoi( token.c_str() ) );
			cout << "value " << token << endl;
		}
	}
	cv::Rect selectRect(values[0], values[1], values[2], values[3]);

	cv::VideoCapture cap(0); // open the default camera
	// cv::VideoCapture cap("capture.MP4"); // open the default camera
	cv::Mat lastImg;
	cv::Mat image;
	// お金を入れたタイミングを検出する処理

	int prevSum = 0;// 前フレームの合計
	int minSum = 0;
	int maxSum = 0;// 
	int cnt = 0; // スレッショルド以上になった回数
	int price = 0;
	while(1){
		int key = cv::waitKey(10);
		if(key == 32){break; }
		if( cap.read(image) ){
			cv::Mat selectImg = image(selectRect);
			cv::Mat selectGrayImg;
			cv::cvtColor(selectImg, selectGrayImg, CV_BGR2GRAY);
			cv::imshow("window", selectImg);
			// 選択した範囲の輝度値の合計を計算
			int sum = calcMatSum(selectGrayImg);
			int diffSum = sum - prevSum;// 前フレームとの差分
			if(diffSum < -40000){
				cnt++;
				price = 500;
				break;
			}
			prevSum = sum;
		}
	}// お金を入れたタイミングを検出する処理ここまで

	// 入金額を返す
	cout << price;
	return 0;

}

