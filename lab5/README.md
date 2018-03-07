#Lab5

##'Related' Criteria
My version of related is defined as follows:
If there is a CD containing both artists' songs, the two artists are related.

This usually means that the two artists' songs have something in common. 
For example, they may be both hot songs in the same year, or both of the same genre 
released in the same year, etc.

## Results
The results is quite similar as the stencil:
```
> node index.js related Madonna "Black Sabbath"
True
> node index.js related "Black Sabbath" Drake
False
> node index.js related "Taylor Swift" Beyonce
True
```
The first one got a different result on `mongodb://bdognom.cs.brown.edu/cdquery1`:
 ```
 > node index.js related Madonna "Black Sabbath"
 False
 ```
For the search command:
```
> node index.js search "Black Sabbath" 5
Queen
Status Quo
Nazareth
Uriah Heep
Bachman-turner Overdrive
> node index.js search "Taylor Swift" 5
Howie Day
Aimee Allen
Elton John
Livvi Franc F Pitbull
50 Cent
> node index.js search "Beyonce" 5
Adele
Bruno Mars
Maroon 5 Ft Christina Aquilera
Dj Antoine Vs Timati Ft Kalenna
Alexandra Stan
```
 