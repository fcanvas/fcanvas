import { Stage } from "fcanvas"

import { portToWorker } from "./port-from-thread"
import Worker from "./worker?worker"

const worker = new Worker()

const stage = new Stage().mount("#app")
portToWorker(worker, stage)
