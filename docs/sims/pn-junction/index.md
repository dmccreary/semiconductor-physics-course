# PN Junction

MicroSim Name: P-N Junction Voltage Controller 

Description:
Using the p5.js JavaScript library, create a real-time visualization of carrier movement, depletion region width, and electric field distribution in a p-n junction. Shows electron and hole trajectories as bias voltage changes from reverse to forward conditions.  Show a cross
section of the semiconductor with one wire on the top and the other wire on the bottom.
Create a slider to allow the user to change the voltage.

Draw the P and N regions in different colors.  Draw animations of elections with a small red circle with a negative sign.

User Input Slider:

   Applied voltage (-5V to +2V) in increments of 1/10 of a volt.

Impact of Input Parameter Changes:

Forward bias: Depletion width decreases, carriers cross junction, exponential current increase
Reverse bias: Depletion width increases, carrier blocking, minimal leakage current


## Future Parameters

Doping concentrations on both sides
Junction area
Temperature
Light illumination (for photodiode mode)

Higher doping: Narrower depletion region, steeper electric field
Temperature increase: Higher leakage current, forward voltage decrease
Light illumination: Photocurrent generation in depletion region