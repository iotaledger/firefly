const passwordReasons = {
    'Straight rows of keys are easy to guess': 'row',
    'Short keyboard patterns are easy to guess': 'pattern',
    'Names and surnames by themselves are easy to guess': 'names',
    'Common names and surnames are easy to guess': 'names',
    'Repeats like "aaa" are easy to guess': 'repeats',
    'Repeats like "abcabcabc" are only slightly harder to guess than "abc"': 'repeats2',
    'Sequences like abc or 6543 are easy to guess': 'sequence',
    'Recent years are easy to guess': 'years',
    'Dates are often easy to guess': 'dates',
    'This is a very common password': 'common',
    'This is similar to a commonly used password': 'similar',
    'A word by itself is easy to guess': 'word',
    'This is a top-10 common password': 'common',
    'This is a top-100 common password': 'common',
}

export default passwordReasons
