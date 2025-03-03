export default class robotAnimation {
    constructor(scene) {
        this.scene = scene;
    }
    moveRobotSuccess(robot) {
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
        });
    }
    fallRobotFail(robot) {
        this.scene.tweens.add({
            targets: robot,
            angle: 90,
            duration: 500,
            ease: 'Bounce.easeOut' // Add bounce effect
        });
        this.scene.time.delayedCall(1500, () => {
            this.scene.tweens.add({
                targets: robot,
                angle: 0,
                duration: 500,
                ease: 'Power1'
            });
        });
    }
    flyAround(robot) {
        const xDirection = Phaser.Math.Between(0, 1) === 0 ? -100 : 100;
        const yDirection = Phaser.Math.Between(0, 1) === 0 ? -200 : 200;
        this.scene.tweens.add({
            targets: robot,
            x: Phaser.Math.Between(xDirection, this.scene.scale.width - 100),
            y: Phaser.Math.Between(yDirection, this.scene.scale.height - 250),
            angle: 180,
            duration: Phaser.Math.Between(500, 1500),
            yoyo: true,
            ease: 'Quad.In' // Smooth easing
        });
    }
}
