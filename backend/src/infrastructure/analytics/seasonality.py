# Calendar helpers: monthly timestamps and the monsoon rhythm of Indian vegetation.
import math
from datetime import date

MONTHS_PER_YEAR = 12
MONSOON_PEAK_MONTH = 9
DRY_SEASON_MONTH = 4


# Lists the first day of each month, oldest first, ending with the month of the given date.
def month_starts(until: date, count: int) -> list[date]:
    year, month = until.year, until.month
    starts: list[date] = []
    for _ in range(count):
        starts.append(date(year, month, 1))
        year, month = (year - 1, MONTHS_PER_YEAR) if month == 1 else (year, month - 1)
    return starts[::-1]


# Swings from +1 at the September monsoon peak to -1 in the dry pre-monsoon months.
def monsoon_wave(month: int) -> float:
    return math.cos(2 * math.pi * (month - MONSOON_PEAK_MONTH) / MONTHS_PER_YEAR)


# Finds the first dry-season month at or after a position, when wildfires are most likely.
def dry_season_index(months: list[date], earliest: int) -> int | None:
    return next(
        (
            index
            for index, month in enumerate(months)
            if index >= earliest and month.month == DRY_SEASON_MONTH
        ),
        None,
    )
