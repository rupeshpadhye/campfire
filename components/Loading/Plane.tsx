import Lottie from "react-lottie";
import animationData from "../../lotties/9844-loading-40-paperplane.json"

const logoOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

export default function Plane() {
        return (
            <div>
                    <Lottie options={logoOptions} />
            </div>
        )
    }
