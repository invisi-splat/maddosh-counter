library(readr)
library(lubridate)

data <- read_csv("count-to-8000.csv", col_types = cols(.default = col_character()))

# Functions

fix_num <- function(data, x) {
  data$Content[x] <- x
  data
}

# Processing
# I did this by manually looking through the data and correcting as I went
# This is why the code may look weird

data["Date"] <- lapply(data["Date"], function(x) { # Convert datetimes to unix
  as.numeric(dmy_hm(x))
})

data <- data[-(1:165), ]
data <- fix_num(data, c(6, 9, 11, 70))
data <- data[-168, ]
data <- fix_num(data, c(208:212))
data <- data[-213, ]
data <- fix_num(data, c(213:227, 246:254))

new_rows <- data.frame(
  AuthorID=rep(c("458304698827669536"), times=10),
  Author=rep(c("invisi.#0561"), times=10),
  Date=rep(c("1616955180"), times=10),
  Content=256:265,
  Attachments=rep(c(""), times=10),
  Reactions=rep(c(""), times=10)
)

data <- rbind(data[1:255, ], new_rows, data[256:length(data$Date), ])
data <- data[-266, ]
data <- fix_num(data, c(255, 269))
data <- data[-285, ]
data <- fix_num(data, c(319:322, 352:364, 400))
data <- data[-(402:409), ]
data <- data[-421, ]
data <- fix_num(data, c(491:495, 506:512))
data <- data[-c(513:514), ]
data <- fix_num(data, c(519:520, 588:600, 651:655))

missing_row <- data.frame(
  AuthorID="302364139488149504",
  Author="MISCOUNT",
  Date="1618351560",
  Content=656,
  Attachments="",
  Reactions=""
)

data <- rbind(data[1:655, ], missing_row, data[656:length(data$Date), ]) # Mansa
data <- fix_num(data, c(656:691, 736:751, 767, 800, 810:829))
data <- data[-830, ]
data <- data[-870, ]
data <- fix_num(data, c(886, 911:912, 928:950))
data <- data[-951, ]
data <- fix_num(data, 951:960)
data <- data[-964, ]

missing_row <- data.frame(
  AuthorID="689918460679028769",
  Author="MISCOUNT",
  Date="1618656960",
  Content=977,
  Attachments="",
  Reactions=""
)

data <- rbind(data[1:976, ], missing_row, data[977:length(data$Date), ]) # Aisha
data <- data[-(1001:1005), ]
data <- data[-1002, ]
data <- fix_num(data, 1012:2678)
data <- data[-(2678:2679), ] # Amalee and https://www.fullblackscreen.com/Aisha
data <- data[-2728, ] # Josh
data <- data[-3454, ] # Mansa
data <- data[-4519, ] # Harrison
data <- data[-(5001:5003), ] # Pinned message
data <- data[-(5285:5286), ] # Harrison and Noah

missing_rows <- data.frame(
  AuthorID=rep(c("485020107559403522"), times=2),
  Author=rep(c("MISCOUNT"), times=2),
  Date=rep(c("1660411440"), times=2),
  Content=7565:7566,
  Attachments=rep(c(""), times=2),
  Reactions=rep(c(""), times=2)
)

data <- rbind(data[1:7564, ], missing_rows, data[7565:length(data$Date), ]) # Amalee
data <- fix_num(data, 2678:length(data$Date))

# Validation with theoretical count
# data$t_count <- 1:length(data$Date) # <- This is only for comparison purposes
# data <- data[, c(1, 2, 3, 5, 6, 4, 7)]
write_csv(data, "cleaned-data.csv", na="")