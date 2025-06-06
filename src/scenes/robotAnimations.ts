export default class robotAnimation {
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }
    private scene: Phaser.Scene;

    public moveRobotSuccess(robot: Phaser.GameObjects.Image) {
        this.scene.tweens.add({
            targets: robot,
            x: robot.x + 300,
            duration: 500,
            yoyo: true,
            ease: 'Power1' // Smooth easing
        });
        this.scene.time.delayedCall(1001, () => {
            this.scene.tweens.add({
                targets: robot,
                x: robot.x - 300,
                duration: 500,
                yoyo: true,
                ease: 'Power1'
            });
        })
    }

    public fallRobotFail(robot: Phaser.GameObjects.Image) {
        this.scene.tweens.add({
            targets: robot,
            angle: 90, // Rotate 90 degrees (fall over)
            duration: 500,
            ease: 'Bounce.easeOut' // Add bounce effect
        });
    
        this.scene.time.delayedCall(1500, () => {
            this.scene.tweens.add({
                targets: robot,
                angle: 0, // Reset rotation
                duration: 500,
                ease: 'Power1'
            });
        });
    }

    public flyAround(robot: Phaser.GameObjects.Image, robotFly: Phaser.GameObjects.Image) {
        robot.setVisible(false);
        robotFly.setVisible(true);
        const xDirection = Phaser.Math.Between(0, 1) === 0 ? -500 : 500;
        const yDirection = Phaser.Math.Between(0, 1) === 0 ? -400 : 400;
        const eases = ['Sine.InOut', 'Linear', 'Cubic.Out'];
        const randomEase = Phaser.Utils.Array.GetRandom(eases);
        this.scene.tweens.add({
            targets: robotFly,
            x: xDirection,
            y: yDirection, 
            angle: 180,
            duration: Phaser.Math.Between(500, 1500),
            yoyo: true, 
            ease: randomEase,
            onComplete: () => {
                robot.setVisible(true);
                robotFly.setVisible(false);
            }
        });
    }
}