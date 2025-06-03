#include <iostream>
#include <string>
using namespace std;

int main() {
    string word;
    int vc = 0;

    cout << "Enter your word: ";
    cin >> word;

    for (char c : word) {
        char lower = tolower(c);
        if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') {
            vc++;
        }
    }

    cout << "Number of vowels: " << vc << endl;
    return 0;
}
