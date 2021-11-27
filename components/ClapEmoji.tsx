import { Button } from "antd";
import React from "react";

type Props = {
    count : number;
    onClick?: () => void;
}
const ClapEmoji: React.FC<Props> = ({ count, onClick  }) => {
    return onClick ? <Button onClick={onClick}>{count} 👏  </Button> : <span> {count} 👏  </span>
}

export default ClapEmoji