import { Scene } from "three";
import createStarfield, { blinkStarField, moveStarField } from "../utils/StarfieldUtil";

const starfieldMain = createStarfield();
const starfieldBlink1 = createStarfield({ "numStars": 50 });
const starfieldBlink2 = createStarfield({ "numStars": 50 });
const starfieldBlink3 = createStarfield({ "numStars": 50 });
const starfieldBlink4 = createStarfield({ "numStars": 50 });
const starfieldBlink5 = createStarfield({ "numStars": 50 });
const starfieldBlink6 = createStarfield({ "numStars": 50 });
const starfieldSlowMove = createStarfield({ "numStars": 2000 });
const starfieldMove = createStarfield({ "numStars": 1000 });
const starfieldFastMove = createStarfield({ "numStars": 500 });


export function loadStarfield(scene: Scene) {
    scene.add(starfieldMain);
    scene.add(starfieldSlowMove);
    scene.add(starfieldMove);
    scene.add(starfieldFastMove);
    scene.add(starfieldBlink1);
    scene.add(starfieldBlink2);
    scene.add(starfieldBlink3);
    scene.add(starfieldBlink4); 
    scene.add(starfieldBlink5);
    scene.add(starfieldBlink6); 

    return scene;
}

export function blinkAllStarFields() {
    blinkStarField(starfieldBlink1);
    blinkStarField(starfieldBlink2);
    blinkStarField(starfieldBlink3);
    blinkStarField(starfieldBlink4);
    blinkStarField(starfieldBlink5);
    blinkStarField(starfieldBlink6);
}

export function updateStarfield() {
    moveStarField(starfieldSlowMove, 0.00001);
    moveStarField(starfieldMove, 0.00005);
    moveStarField(starfieldFastMove, 0.00025);
}