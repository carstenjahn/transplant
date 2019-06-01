export class ScoreLives {
    private score = 0;
    private lives = 5;
    private _scoreElement: HTMLDivElement;
    private _livesElement: HTMLDivElement;

    constructor() {
        this._scoreElement = document.createElement("div");
        this._livesElement = document.createElement("div");
        this._scoreElement.classList.add("text-score");
        this._livesElement.classList.add("text-lives");
        this.updateElementContents();
    }

    get scoreElement(): HTMLDivElement {
        return this._scoreElement;
    }

    get livesElement(): HTMLDivElement {
        return this._livesElement;
    }

    private updateElementContents() {
        this._scoreElement.textContent = String(this.score);
        this._livesElement.innerHTML = "&hearts;".repeat(this.lives);
    }

    public addScore(s: number) {
        this.score += s;
        this.updateElementContents();
    }

    public substractLife() {
        this.lives = Math.max(this.lives - 1, 0);
        this.updateElementContents();
    }
}