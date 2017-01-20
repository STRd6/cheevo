require "./style.css"
AchievementTemplate = require "./templates/achievement"

module.exports =
  display: (options={}) ->
    options.icon ?= "🏆"
    options.title ?= "Achievement Unlocked"
    options.text ?= ""

    # TODO: Optional Sound
    # TODO: Animation

    achievementElement = AchievementTemplate(options)

    document.body.appendChild achievementElement

    setTimeout ->
      achievementElement.remove()
    , 10000

    return achievementElement
