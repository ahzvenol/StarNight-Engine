import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge {
        return .all    // 延迟系统手势，单次上划显示 Home Indicator，再次上划触发后台切换
    }
}
