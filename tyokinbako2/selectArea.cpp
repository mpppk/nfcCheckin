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

typedef struct MouseParam{
	unsigned int x;
	unsigned int y;
	int event;
	int flags;
	string action;
} MouseParam;

MouseParam g_param;

void onMouse( int event, int x, int y, int flag, void* param) {
  std::string desc;

  MouseParam *mparam = (MouseParam*)param;
	mparam->x = x;
	mparam->y = y;
	mparam->event = event;
	mparam->flags = flag;
	mparam->action = "";

  // マウスイベントを取得
  switch(event) {
  case cv::EVENT_MOUSEMOVE:
	desc += "MOUSE_MOVE";
	break;
  case cv::EVENT_LBUTTONDOWN:
    mparam->action = "down";
	desc += "LBUTTON_DOWN";
	break;
  case cv::EVENT_RBUTTONDOWN:
	desc += "RBUTTON_DOWN";
	break;
  case cv::EVENT_MBUTTONDOWN:
	desc += "MBUTTON_DOWN";
	break;
  case cv::EVENT_LBUTTONUP:
    mparam->action = "up";
	desc += "LBUTTON_UP";
	break;
  case cv::EVENT_RBUTTONUP:
	desc += "RBUTTON_UP";
	break;
  case cv::EVENT_MBUTTONUP:
	desc += "MBUTTON_UP";
	break;
  case cv::EVENT_LBUTTONDBLCLK:
	desc += "LBUTTON_DBLCLK";
	break;
  case cv::EVENT_RBUTTONDBLCLK:
	desc += "RBUTTON_DBLCLK";
	break;
  case cv::EVENT_MBUTTONDBLCLK:
	desc += "MBUTTON_DBLCLK";
	break;
  }

  // マウスボタン，及び修飾キーを取得
  if(flag & cv::EVENT_FLAG_LBUTTON)
	desc += " + LBUTTON";
  if(flag & cv::EVENT_FLAG_RBUTTON)
	desc += " + RBUTTON";
  if(flag & cv::EVENT_FLAG_MBUTTON)
	desc += " + MBUTTON";
  if(flag & cv::EVENT_FLAG_CTRLKEY)
	desc += " + CTRL";
  if(flag & cv::EVENT_FLAG_SHIFTKEY)
	desc += " + SHIFT";
  if(flag & cv::EVENT_FLAG_ALTKEY)
	desc += " + ALT";

  // std::cout << desc << " (" << x << ", " << y << ")" << std::endl;
}

int main(){
	// 着目する領域を決定
	cv::Mat image;
	// cv::VideoCapture cap("capture.MP4"); // open the default camera
	cv::VideoCapture cap(0); // open the default camera
	// cv::VideoCapture cap(0); // open the default camera
	MouseParam param;// マウスイベントのコールバックを受け取る
	if(!cap.isOpened())	return -1;

	cv::namedWindow("window",CV_WINDOW_AUTOSIZE);

	cv::setMouseCallback("window", onMouse, &param);
	int key;
	bool isDown = false;
	bool isUp = false;
	cv::Point firstClickPt, secondClickPt;

	bool fcEmpty = true;
	bool fcFlag = false;
	bool scEmpty = true;
	cv::Mat lastImg;// テスト用

	// 切り出し部分を決定する処理
	while(1){
		key = cv::waitKey(10);
		if(key == 32){
			lastImg = image;
			break;
		}
		cv::Point mousePoint(param.x, param.y);

		if(param.action == "down"){isDown = true; }
		if(param.action == "up"){isUp = true; }

		if(fcFlag && isDown){
			firstClickPt = cv::Point(param.x, param.y);
			fcFlag = false;
			scEmpty = true;
		}
		if(fcEmpty && isDown){
			firstClickPt = cv::Point(param.x, param.y);
			fcEmpty = false;
		}
		if(scEmpty && isUp){
			secondClickPt = cv::Point(param.x, param.y);
			scEmpty = false;
		}
		if(!fcEmpty && !scEmpty){
			isDown = false;
			isUp = false;
			fcFlag = true;
		}

		if( cap.read(image) ){
			if(!fcEmpty)	cv::circle(image, firstClickPt, 5, cv::Scalar(255, 0, 0));
			if(!scEmpty)	cv::circle(image, secondClickPt, 5, cv::Scalar(0, 255, 0));
			cv::imshow("window", image);
		}
	}// 切り出し部分を決定する処理ここまで

	int width = abs(secondClickPt.x - firstClickPt.x);
	int height = abs(secondClickPt.y - firstClickPt.y);
	cout << "x " << firstClickPt.x << "  y " << firstClickPt.y << "  w " << width << "  h " << height << endl;
	cv::Rect selectRect(firstClickPt.x, firstClickPt.y, width, height);
	cv::Mat areaMat(1, 4, CV_64F);
	areaMat.at<double>(0, 0) = firstClickPt.x;
	areaMat.at<double>(0, 1) = firstClickPt.y;
	areaMat.at<double>(0, 2) = width;
	areaMat.at<double>(0, 3) = height;
	// cv::imwrite("selectArea.jpg", areaMat);
	ofstream ofs("selectArea.csv");
	ofs << cv::format(areaMat, "csv") << endl;

	return 0;
}

