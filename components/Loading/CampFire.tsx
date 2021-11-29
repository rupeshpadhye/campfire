import Lottie from "react-lottie";
import animationData from "../../lotties/campfire.json"

const logoOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

export default function CampFire() {
        return (
            <div>
            <Lottie options={logoOptions} height={400} width={400} />
            </div>
        )
    }
