

CREATE TABLE `message` (
  `Id` int(11) NOT NULL,
  `Text` varchar(255) NOT NULL,
  `From` varchar(32) NOT NULL,
  `To` varchar(32) NOT NULL,
  `DateTime` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TABLE `userlist` (
  `Id` int(11) NOT NULL,
  `Email` varchar(64) NOT NULL,
  `Handle` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



ALTER TABLE `message`
  ADD PRIMARY KEY (`Id`);


ALTER TABLE `userlist`
  ADD PRIMARY KEY (`Id`);


ALTER TABLE `message`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

ALTER TABLE `userlist`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;COMMIT;

