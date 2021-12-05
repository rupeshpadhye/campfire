import Lottie from "react-lottie";
import animationData from "../../lotties/snow.json"

const logoOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

export default function Snow() {
        return (
            <div>
                    <Lottie options={logoOptions} />
            </div>
        )
    }
