//==========================================================================
// Eli_Timer.js
//==========================================================================

/*:
@plugindesc ♦5.2.0♦ Add new mechanics to the default timer!
@author Hakuen Studio

@help
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
If you like my work, please consider supporting me on Patreon!
Patreon      → https://www.patreon.com/hakuenstudio
Terms of Use → https://www.hakuenstudio.com/terms-of-use-5-0-0
Facebook     → https://www.facebook.com/hakuenstudio
Instagram    → https://www.instagram.com/hakuenstudio
Twitter      → https://twitter.com/hakuen_studio
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
==============================================================================
Plugin Requirements
==============================================================================

Eli Book is mandatory.

Order After Eli Book
Order After Eli Bitmap Font
Order After Eli Font Manager

==============================================================================
Features
==============================================================================

• Pause/Resume timer.
• Start timer paused.
• Add/Remove seconds and minutes.
• You can change it to count upwards(1, 2, 3, 4...) instead of default 
count down.
• Turn on a switch when timer is working.
• Change the text color and outline color of the timer.
• Add hours and milliseconds.
• Optionally change the format of the timer text to show:
00:00:00:00
(Hours:Minutes:Seconds:Milliseconds)

==============================================================================
How to use
==============================================================================

♦ Plugin Parameter ♦

● Timer Flow

Will decide if the timer will count upwards or downwards.

● Format of the Timer

This will define how your timer you show.
By default, RPG maker shows it to you like that: 00:00 (Minutes: Seconds)

But this plugin adds hours and milliseconds.
So you can show it like that: 00:00:00:00 
(Hours:Minutes:Seconds:Milliseconds)

So, in the plugin parameter, you will see that you have a list, with 
4 options:
Hours, Minutes, Seconds, and Milliseconds.

You can choose what Time Units you will use and also their order, by 
placing them on the list.
So let's say you just want to have a timer with Seconds:Milliseconds? 
You just need to exclude Hours and Minutes and let only Seconds and 
Milliseconds.
You can combine them to achieve the result you want. 

● Fix Shaking

If you pay attention to the timer text on RPG Maker, you will notice 
that it shakes a little bit when it gets updated.
When using only Minutes:Seconds, you will not notice it so much.
But when using Milliseconds, you will notice it a lot.
So if you set this to true, it will prevent this shaking from happening.

The other plugin parameters are self-explanatory.

♦ Script calls ♦

• $gameTimer.flow() → Will return 'Up' or 'Down', according to the 
flow of the timer.
• $gameTimer.isPaused() → Returns true if the timer is paused.

• $gameTimer.milliseconds() → Return the current milliseconds count.
• $gameTimer.seconds() → Return the current seconds count.
• $gameTimer.minutes() → Return the current minutes count.
• $gameTimer.hours() → Return the current hours count.

Return the max value when the timer has when it started or when it is 
finished.

• $gameTimer.getMaxMilliseconds() → Return the max milliseconds count.
• $gameTimer.getMaxSeconds() → Return the max seconds count.
• $gameTimer.getMaxMinutes() → Return the max minutes count.
• $gameTimer.getMaxHours() → Return the max hours count.

• $gameTimer.getTextForMilliseconds() → Return the current milliseconds 
in text format.
• $gameTimer.getTextForSeconds() → Return the current seconds in text 
format.
• $gameTimer.getTextForMinutes() → Return the current minutes in text 
format.
• $gameTimer.getTextForHours() → Return the current hours in text format.

• $gameTimer.getText() → Return the current timer in text format 
(the one you are seeing on the screen).

♦ Plugin Commands ♦

• StartTimer Minutes Seconds → Start the timer with the specified minutes and 
seconds.
• TimerChange Minutes Seconds → Add or remove from the current timer
(if you use negative values).
• TimerFlow Flow → Replace Flow with Up or Down. Not case sensitive.
• PauseTimer → Pause the timer.
• ResumeTimer → Resume the timer.
• StopTimer → Stop the timer.
• TimerColor TextColor OutlineColor → Replace TextColor and OutlineColor 
with any color you want.
You can use hex, html, rgb, and rgba. For RGB(A), you cannot use spaces, 
so separate each color with an _(underscore).

Example:
TimerColor #ffffff 0_0_0_125

NOTE¹: You can use variables on Minutes and Seconds. \v[ID]

============================================================================
Update Log
============================================================================

https://tinyurl.com/timerLog

============================================================================

@param startPaused
@text Start paused
@type boolean
@desc Start the timer paused.
@default false

@param workingSwitch
@text Working Switch
@desc Turn a switch on when the timer is working.
@type switch
@default 0

@param flow
@text Timer Flow
@desc Choose if you want the timer to count down or count up.
@type select
@option Up
@option Down
@default Down

@param textUnits
@text Format of the timer
@desc Choose the format of the timer to show only seconds and minutes or hours.
@type select[]
@option Hours
@option Minutes
@option Seconds
@option Milliseconds
@default ["Hours","Minutes","Seconds","Milliseconds"]

@param textColor
@text Text color
@type text
@desc Change the default text color. Can use hex, html rgb and rgba colors. Default is white.
@default white

@param outlineColor
@text Outline color
@type text
@desc Change the outline color. Can use hex, html rgb and rgba colors. Default is rgba(0, 0, 0, 0.6).
@default rgba(0, 0, 0, 0.6)

@param fixShaking
@text Fix Shaking
@type boolean
@desc If true, the timer text will reduce it's shaking when updating the current count.
@default true

@param hideOnEnd
@text Hide Timer On End
@type boolean
@desc If true, the timer will hide when it ends the count.
@default true

@param hideOnPause
@text Hide Timer On Pause
@type boolean
@desc If true, the timer will hide when it is paused.
@default true

*/

"use strict"

var Eli = Eli || {}
var Imported = Imported || {}
Imported.Eli_Timer = true

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
{

Eli.Timer = {

    version: 5.20,
    url: "https://hakuenstudio.itch.io/eli-timer-for-rpg-maker-mv",
    parameters: {
        flow: '',
        outlineColor: '',
        startPaused: false,
        textUnits: ["Hours", "Minutes", "Seconds", "Milliseconds"],
        textColor: '',
        workingSwitch: 0,
        fixShaking: true,
        hideOnEnd: true,
        hideOnPause: true,
    },
    alias: {},

    initialize(){
        this.initParameters()
        this.initPluginCommands()
    },

    initParameters(){
        this.parameters = Eli.PluginManager.createParameters()
        this.parameters.textColor = Eli.ColorManager.getHexOrName(this.parameters.textColor)
        this.parameters.outlineColor = Eli.ColorManager.getHexOrName(this.parameters.outlineColor)
        this.parameters.textUnits.length = Math.min(this.parameters.textUnits.length, 4)
    },

    initPluginCommands(){},

    param(){
        return this.parameters
    },

/* ----------------------------- PLUGIN COMMAND ----------------------------- */

    start(args) {
        const sec = Number(Eli.Utils.convertEscapeVariablesOnly(args.seconds))
        const min = Number(Eli.Utils.convertEscapeVariablesOnly(args.minutes))
        const timer = (sec*60) + (min*60**2)
    
        if($gameTimer.isWorking()){
            $gameTimer.changeFrames(timer)
        }else{
            $gameTimer.start(timer)
        }
    },
    
    pause() {
        $gameTimer.pause()
    },
    
    resume() {
        $gameTimer.resume()
    },
    
    changeFlow(args) {
        $gameTimer.setFlow(args.flow)
    },

    changeColor(args){
        const textColor = Eli.ColorManager.getHexOrName(args.text)
        const outlineColor = Eli.ColorManager.getHexOrName(args.outline)
        const timerSprite = SceneManager._scene._spriteset._timerSprite

        $gameTimer.changeTextColor(textColor)
        $gameTimer.changeOutlineColor(outlineColor)
        timerSprite.changeBitmapColors(textColor, outlineColor)
    },

    executePluginCommandMV(command, args){
        const cmdList = {
            STARTTIMER: 'startMV',
            PAUSETIMER: 'pause',
            RESUMETIMER: 'resume',
            TIMERFLOW: 'changeFlowMV',
            STOPTIMER: 'stop',
            TIMERCHANGE: 'startMV',
            TIMERCOLOR: 'changeColorMV',
        }
        const cmd = cmdList[command.toUpperCase()]
        if(this[cmd]) {
            this[cmd](args)
        }
    },

    startMV(args){
        const mzArgs = {
            minutes: args[0],
            seconds: args[1] || "0",
        }
        this.start(mzArgs)
    },

    changeFlowMV(args){
        const flow = {up: "Up", down: "Down"}[args[0].toLowerCase()]
        const mzArgs = {
            flow:flow,
        }
        this.changeFlow(mzArgs)
    },

    changeColorMV(args){
        let [textColor, outlineColor] = args.map(item => item.includes("_") ? item.split("_") : item)
        const mzArgs = {
            text: textColor,
            outline: outlineColor,
        }
        this.changeColor(mzArgs)
    },

}

const Plugin = Eli.Timer
const Alias = Eli.Timer.alias

Plugin.initialize()

/* ------------------------------- GAME TIMER ------------------------------- */
{

Alias.Game_Timer_initialize = Game_Timer.prototype.initialize
Game_Timer.prototype.initialize = function() {
    Alias.Game_Timer_initialize.call(this)
    this.initNewProperties()
}

Alias.Game_Timer_start = Game_Timer.prototype.start
Game_Timer.prototype.start = function(count) {
    this.beforeStart(count)
    Alias.Game_Timer_start.call(this, count)
    this.afterStart(count)
}

Alias.Game_Timer_stop = Game_Timer.prototype.stop
Game_Timer.prototype.stop = function() {
    Alias.Game_Timer_stop.call(this)
    this.clearFlags()
}

Alias.Game_Timer_update = Game_Timer.prototype.update;
Game_Timer.prototype.update = function(sceneActive) {
    if(!this.isPaused()){

        if(this.getFlow() === 'Up'){
            this.updateUpCount(sceneActive)
        }else{
            Alias.Game_Timer_update.call(this, sceneActive)
        }
    }
}

Alias.Game_Timer_onExpire = Game_Timer.prototype.onExpire;
Game_Timer.prototype.onExpire = function() {
    Alias.Game_Timer_onExpire.call(this)
    this.afterOnExpire()
}

Game_Timer.prototype.initNewProperties = function(){
    this._text = ""
    this._maxFrames = 0
    this._maxSeconds = 0
    this.applySettings(Plugin.param())
}

Game_Timer.prototype.applySettings = function(settings){
    this._maxUnitMembers = settings.textUnits.length
    this._countFlow = settings.flow
    this._pause = settings.startPaused
    this.changeTextColor(settings.textColor)
    this.changeOutlineColor(settings.outlineColor)
}

Game_Timer.prototype.changeTextColor = function(color){
    this._textColor = Eli.ColorManager.getHexOrName(color)
}

Game_Timer.prototype.changeOutlineColor = function(color){
    this._outlineColor = Eli.ColorManager.getHexOrName(color)
}

Game_Timer.prototype.beforeStart = function(count){
    this.setText("")
    this._maxUnitMembers = Plugin.param().textUnits.length
    this._maxFrames = count
    this._maxSeconds = count / 60
    this._pause = Plugin.param().startPaused
}

Game_Timer.prototype.setText = function(text){
    this._text = text
}

Game_Timer.prototype.afterStart = function(count){
    if(this.getFlow() === 'Up') {
        this._frames = 0
    }

    $gameSwitches.setValue(Plugin.param().workingSwitch, true)
}

Game_Timer.prototype.clearFlags = function() {
    this._pause = false
    $gameSwitches.setValue(Plugin.param().workingSwitch, false)
}

Game_Timer.prototype.isPaused = function() {
    return this._pause
}

Game_Timer.prototype.getFlow = function(){
    return this._countFlow
}

Game_Timer.prototype.updateUpCount = function(sceneActive){
    if (sceneActive && this._working && this._frames < this._maxFrames) {
        this._frames++

        if (this._frames === this._maxFrames) {
            this.onExpire()
        }
    }
}

Game_Timer.prototype.afterOnExpire = function(){
    this.clearFlags()
    if(Plugin.param().hideOnEnd){
        this.stop()
    }
}

Game_Timer.prototype.setFlow = function(direction){
    this._countFlow = direction
}

Game_Timer.prototype.changeFrames = function(value){
    this._frames += value
}

Game_Timer.prototype.pause = function() {
    this._pause = true
}

Game_Timer.prototype.resume = function() {
    this._pause = false
}

Game_Timer.prototype.milliseconds = function() {
    return Eli.Date.framesToMilliSeconds(this._frames)
}

Game_Timer.prototype.minutes = function() {
    return Math.floor(this.seconds() / 60)
}

Game_Timer.prototype.hours = function() {
    return Math.floor(this.minutes() / 60)
}

Game_Timer.prototype.getTextForMilliseconds = function(){
    const ms = Eli.Date.framesToMilliSeconds(this._frames % 60) / 10
    return Math.floor(ms).padZero(2)
}

Game_Timer.prototype.getTextForSeconds = function(){
    return (this.seconds() % 60).padZero(2)
}

Game_Timer.prototype.getTextForMinutes = function(){
    return (this.minutes() % 60).padZero(2)
}

Game_Timer.prototype.getTextForHours = function(){
    return this.hours().padZero(2)
}

Game_Timer.prototype.createText = function(){
    let text = ""
    for(let i = 0; i < this._maxUnitMembers; i++){
        const unit = Plugin.param().textUnits[i]
        const value = this[`getTextFor${unit}`]()
        text += `${value}:`
        
    }
    const finalText = text.substring(0, text.length-1)

    return finalText
}

Game_Timer.prototype.createBlankText = function(){
    let text = ""
    for(let i = 0; i < this._maxUnitMembers; i++){
        text += `00:`
        
    }
    const finalText = text.substring(0, text.length-1)

    return finalText
}

Game_Timer.prototype.getText = function(){
    return this._text
}

Game_Timer.prototype.getMaxMilliseconds = function() {
    return Eli.Date.framesToMilliSeconds(this._maxFrames)
}

Game_Timer.prototype.getMaxSeconds = function() {
    return Eli.Date.framesToSeconds(this._maxFrames)
}

Game_Timer.prototype.getMaxMinutes = function() {
    return Eli.Date.framesToMinutes(this._maxFrames)
}

Game_Timer.prototype.getMaxHours = function() {
    return Eli.Date.framesToHours(this._maxFrames)
}

Game_Timer.prototype.getMaxFrames = function() {
    return this._maxFrames
}

Game_Timer.prototype.textColor = function(){
    return this._textColor
}

Game_Timer.prototype.outlineColor = function(){
    return this._outlineColor
}

}

/* ---------------------------- GAME INTERPRETER ---------------------------- */
{

Alias.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
Game_Interpreter.prototype.pluginCommand = function (command, args) {
Alias.Game_Interpreter_pluginCommand.call(this, command, args)
    Plugin.executePluginCommandMV(command, args)
}

}

/* ------------------------------ SPRITE TIMER ------------------------------ */
{

Alias.Sprite_Timer_initialize = Sprite_Timer.prototype.initialize
Sprite_Timer.prototype.initialize = function() { 
    this.text = ""
    this.widthTable = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 
        5: 0, 6: 0, 7: 0, 8: 0, 9: 0,
        ":": 0
    }
    Alias.Sprite_Timer_initialize.call(this)
}

Alias.Sprite_Timer_redraw = Sprite_Timer.prototype.redraw
Sprite_Timer.prototype.redraw = function() {
    if(Plugin.param().fixShaking){
        this.redrawBitmapWithoutShake()
    }else{
        Alias.Sprite_Timer_redraw.call(this)
    }
}

Alias.Sprite_Timer_createBitmap = Sprite_Timer.prototype.createBitmap
Sprite_Timer.prototype.createBitmap = function() {
    Alias.Sprite_Timer_createBitmap.call(this)
    this.refreshWidthTable()
    this.bitmap = new Bitmap(this.calculateBitmapWidth(), 48)
    this.changeBitmapColors($gameTimer.textColor(), $gameTimer.outlineColor())

    if(Imported.Eli_FontManager){
        this.setFontSettings()
        
    }else if(Imported.Eli_BitmapFont && Eli.BitmapFont.pro){
        this.setBitmapFont()
    }
}

// Overwrite
Sprite_Timer.prototype.updateBitmap = function() {
    if($gameTimer.isWorking()){
        const newtext = $gameTimer.createText()
        if($gameTimer.getText() !== newtext){
            $gameTimer.setText(newtext)
            this.redraw()
        }
    }
}

// Overwrite
Sprite_Timer.prototype.timerText = function() {
    return $gameTimer.getText()
}

Sprite_Timer.prototype.refreshWidthTable = function() {
    const numberWidth = this.bitmap.measureTextWidth("0")
    const twoPointsWidth = this.bitmap.measureTextWidth(":")
    this.widthTable = {
        0: numberWidth, 1: numberWidth, 2: numberWidth, 3: numberWidth, 4: numberWidth, 
        5: numberWidth, 6: numberWidth, 7: numberWidth, 8: numberWidth, 9: numberWidth,
        ":": twoPointsWidth
    }
}

Sprite_Timer.prototype.redrawBitmapWithoutShake = function() {
    const text = this.timerText()
    const width = this.bitmap.width
    const height = this.bitmap.height
    let x = 0

    this.bitmap.clear()

    for(let i = 0; i < text.length; i++){
        const letter = text[i]
        const letterWidth = this.widthTable[letter]
        this.bitmap.drawText(letter, x, 0, width, height, "left")
        x += letterWidth
    }
}

Sprite_Timer.prototype.calculateBitmapWidth = function() {
    return this.bitmap.measureTextWidth($gameTimer.createBlankText()) + 10
}

Sprite_Timer.prototype.changeBitmapColors = function(textColor, outlineColor){
    this.bitmap.textColor = textColor || this.bitmap.textColor
    this.bitmap.outlineColor = outlineColor || this.bitmap.outlineColor
}

Sprite_Timer.prototype.updateVisibility = function(){
    this.visible = $gameTimer.isWorking() && !this.canHideOnPause()
}

Sprite_Timer.prototype.canHideOnPause = function(){
    return $gameTimer.isPaused() && Plugin.param().hideOnPause
}

}

}