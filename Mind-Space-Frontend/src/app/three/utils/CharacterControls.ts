import * as THREE from 'three'
import { getPlayerAnimationsMap, getPlayerMixer, getPlayerModel, getPlayerPhysicsBody, getPunchHitBox } from '../loaders/PlayerLoader'
import { Vec3 } from 'cannon-es';

export class CharacterControls {
    private DIRECTIONS = ['w', 'a', 's', 'd']
    private keysPressed = {}

    private model: THREE.Object3D<THREE.Object3DEventMap>;
    private mixer: THREE.AnimationMixer
    private animationsMap: Map<string, THREE.AnimationAction> = new Map()
    private camera: THREE.PerspectiveCamera;

    // state
    private currentAction: string
    private play = 'mousey_breathing_idle';
    private punchQuaternion: THREE.QuaternionLike;
    private punchStateLock = false;

    // temporary data
    private walkDirection = new THREE.Vector3()
    private rotateAngle = new THREE.Vector3(0, 1, 0)
    private rotateQuarternion: THREE.Quaternion = new THREE.Quaternion()
    private cameraTarget = new THREE.Vector3()
    private dashCooldown = 0;
    private dashCDSwitch = false;
    private dashingBoolean = false;
    private dashingTime = 0;
    private moveX: number;
    private moveZ: number;
    private punchAnimationTimer = 0;
    private punchAnimationTimerSwitch = false;
    private dashAnimationTimer = 0;
    private dashAnimationTimerSwitch = false;
    private preventorOfTPosesBoolean = false;

    // constants
    private fadeDuration: number = 0.2
    private forwardOffset: THREE.Vector3;

    constructor(currentAction: string, camera: THREE.PerspectiveCamera) {
        this.model = getPlayerModel();
        this.init();
        this.currentAction = currentAction
        this.camera = camera;

        //add key listener
        document.addEventListener('keydown', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = true;
        }, false);
        document.addEventListener('keyup', (event) => {
            (this.keysPressed as any)[event.key.toLowerCase()] = false

            if (event.key.toLowerCase() == ' ') {
                this.punchStateLock = false;
            }
        }, false);

    }

    private async init() {
        this.mixer = await getPlayerMixer();
        this.animationsMap = await getPlayerAnimationsMap();

        if (this.model) {
            this.model.rotation.set(0, Math.PI, 0);
        }

        this.animationsMap.forEach((value, key) => {
            if (key == this.currentAction) {
                value.play()
            }
        })
    }

    public update(delta: number) {
        const directionPressed = this.DIRECTIONS.some(key => this.keysPressed[key] == true)
        this.forwardOffset = new THREE.Vector3(0, 3, 2);

        if (directionPressed) {
            this.play = 'mousey_run'
        } else if (this.keysPressed[" "] && !this.punchStateLock) {
            //cannot really alternate and no time alr bru
            this.play = 'mousey_punch1';
            this.punchStateLock = true;

        } else if (this.keysPressed["q"] && this.dashCooldown <= 0) {
            this.play = 'mousey_dash'
        } else {
            this.play = 'mousey_breathing_idle'
        }

        //simple logic for dash cd
        if (this.dashCDSwitch) {
            this.dashCooldown -= delta;
        }
        if (this.dashCooldown <= 0) {
            this.dashCDSwitch = false;
        }

        if (this.animationsMap.get(this.currentAction)) {
            //please let this fix the animation bug (future me to say it did)
            if (this.punchAnimationTimerSwitch) {
                this.punchAnimationTimer += delta;
                this.preventorOfTPosesBoolean = true;

                //means animation done
                if (this.punchAnimationTimer >= this.animationsMap.get('mousey_punch1').getClip().duration) {
                    this.animationsMap.get('mousey_punch1').fadeOut(this.fadeDuration);
                    this.punchAnimationTimerSwitch = false;
                    this.punchAnimationTimer = 0;
                    getPunchHitBox().velocity.set(0, 0, 0);
                    getPunchHitBox().collisionResponse = false;
                }
            }
            if (this.dashAnimationTimerSwitch) {
                this.dashAnimationTimer += delta;
                this.preventorOfTPosesBoolean = true;

                //means animation done
                if (this.dashAnimationTimer >= this.animationsMap.get('mousey_dash').getClip().duration) {
                    this.animationsMap.get('mousey_dash').fadeOut(this.fadeDuration);
                    this.dashAnimationTimerSwitch = false;
                    this.dashAnimationTimer = 0;
                }
            }

            //to make sure the current action isnt alr playing, preventor of T-poses is just to give an entry into the if block for specific edge cases
            if (this.currentAction != this.play || this.preventorOfTPosesBoolean) {

                const toPlay = this.animationsMap.get(this.play);
                const current = this.animationsMap.get(this.currentAction);

                //the check for none of the other animations has to run first or t pose will strike for a few frames
                if (!this.animationsMap.get('mousey_dash').isRunning() && !this.animationsMap.get('mousey_punch1').isRunning()) {

                    if (this.preventorOfTPosesBoolean) {
                        if (this.preventorOfTPosesBoolean) {
                            this.preventorOfTPosesBoolean = false;
                        }
                    }
                    current.fadeOut(this.fadeDuration);
                    toPlay.reset().fadeIn(this.fadeDuration).play();


                    //logic for punch
                    if (this.play == 'mousey_punch1') {
                        current.fadeOut(this.fadeDuration).reset().stop();
                        //logic for hit detection
                        getPunchHitBox().velocity.set(0, 0, 0);
                        //this controls power of the punch
                        this.forwardOffset = new THREE.Vector3(0, 300, 200);
                        getPunchHitBox().collisionResponse = true;
                        this.punchQuaternion = getPlayerModel().quaternion;
                        getPunchHitBox().quaternion.set(this.punchQuaternion.x, this.punchQuaternion.y, this.punchQuaternion.z, this.punchQuaternion.w);
                        this.forwardOffset.applyQuaternion(this.punchQuaternion)
                        this.forwardOffset.add(getPlayerModel().position)
                        getPunchHitBox().velocity.set(this.forwardOffset.x, 0, this.forwardOffset.z)

                        toPlay.clampWhenFinished = true;
                        toPlay.reset().setLoop(THREE.LoopOnce, 1).play();
                        this.punchAnimationTimerSwitch = true;

                    } else if (this.play == 'mousey_dash') {
                        //logic for dash
                        current.fadeOut(this.fadeDuration).reset().stop();

                        toPlay.clampWhenFinished = true;
                        toPlay.reset().setLoop(THREE.LoopOnce, 1).play();
                        this.dashingBoolean = true;
                        this.dashAnimationTimerSwitch = true;

                        this.dashCooldown = 3;
                        this.dashCDSwitch = true;
                    }

                    this.currentAction = this.play
                }
            }


        }

        if (this.mixer) {
            this.mixer.update(delta)
        }

        //movement + camera logic
        if (this.animationsMap.get('mousey_dash')) {
            if (this.currentAction == 'mousey_run' || this.animationsMap.get('mousey_dash').isRunning()) {
                // calculate towards camera direction
                // took me so long to fix the mesh direction bruh
                var angleYCameraDirection = Math.atan2(
                    (this.model.position.x - this.camera.position.x),
                    (this.model.position.z - this.camera.position.z))

                // diagonal movement angle offset
                var directionOffset = this.directionOffset(this.keysPressed)

                // rotate model
                this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset)
                this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.1)

                // calculate direction
                this.camera.getWorldDirection(this.walkDirection)
                this.walkDirection.y = 0
                this.walkDirection.normalize()
                this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)

                // move model & camera
                //this.walkDirection.x * 10 * delta
                //10 is speed (velocity)
                if (this.dashingBoolean) {
                    this.moveX = this.walkDirection.x * 75 * delta
                    this.moveZ = this.walkDirection.z * 75 * delta

                    this.dashingTime += delta;
                    if (this.dashingTime > 0.63) {
                        this.dashingTime = 0;
                        this.dashingBoolean = false;
                    }
                } else {
                    this.moveX = this.walkDirection.x * 15 * delta
                    this.moveZ = this.walkDirection.z * 15 * delta
                }

                //to make sure player dont move out of bounds
                if (!(Math.abs(getPlayerPhysicsBody().position.x) > 100)) {
                    getPlayerPhysicsBody().position.x += this.moveX;
                } else {    //the stuck preventor
                    if (getPlayerPhysicsBody().position.x > 0) {
                        getPlayerPhysicsBody().position.x -= 0.1;
                    } else {
                        getPlayerPhysicsBody().position.x += 0.1;
                    }
                }
                if (!(Math.abs(getPlayerPhysicsBody().position.z) > 100)) {
                    getPlayerPhysicsBody().position.z += this.moveZ;
                } else {    //the stuck preventor
                    if (getPlayerPhysicsBody().position.z > 0) {
                        getPlayerPhysicsBody().position.z -= 0.1;
                    } else {
                        getPlayerPhysicsBody().position.z += 0.1;
                    }
                }

                getPlayerPhysicsBody().quaternion.set(getPlayerModel().quaternion.x, getPlayerModel().quaternion.y, getPlayerModel().quaternion.z, getPlayerModel().quaternion.w);
                this.updateCameraTarget(this.moveX, this.moveZ);
            }

            this.punchQuaternion = getPlayerModel().quaternion;
            getPunchHitBox().quaternion.set(this.punchQuaternion.x, this.punchQuaternion.y, this.punchQuaternion.z, this.punchQuaternion.w);
            //ty simondev for this wonderful formula/solution im using in a unrelated context
            this.forwardOffset.applyQuaternion(this.punchQuaternion)
            this.forwardOffset.add(getPlayerModel().position)
            getPunchHitBox().position.copy(new Vec3(this.forwardOffset.x, this.forwardOffset.y, this.forwardOffset.z))
        }
    }

    private updateCameraTarget(moveX: number, moveZ: number) {
        // move camera
        this.camera.position.x += moveX
        this.camera.position.z += moveZ

        // update camera target
        this.cameraTarget.x = this.model.position.x
        this.cameraTarget.y = this.model.position.y + 1
        this.cameraTarget.z = this.model.position.z
    }


    private directionOffset(keysPressed: any) {
        var directionOffset = 0 // w

        if (keysPressed['w']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed['d']) {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed['s']) {
            if (keysPressed['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed['a']) {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed['d']) {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}