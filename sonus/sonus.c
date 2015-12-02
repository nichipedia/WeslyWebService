/*  Team Sonus - 2015
 *  ------------------------------------------------------------
 *  Uses CMU pocketsphinx to reconize voice commands
 *  Recieves a path to a wav file as argv
 *  Writes the recognized string to stdout and to commands.log
 */
#include <stdio.h>
#include <pocketsphinx.h>

int main(int argc, char *argv[]) {
    ps_decoder_t *ps;
    cmd_ln_t *config;
    FILE *fh;
    char const *hyp, *uttid;
    int16 buf[512];
    int rv;
    int32 score;

    config = cmd_ln_init(NULL, ps_args(), TRUE,
            "-hmm",    MODELDIR "/en-us/en-us",
            "-lm",     MODELDIR "/en-us/en-us.lm.bin",
            "-dict",   MODELDIR "/en-us/cmudict-en-us.dict",
            NULL);

    if (config == NULL) {
        fprintf(stderr, "Failed to create config object, see log for details\n");
        return -1;
    }
    
    // Initialize pocketsphinx
    ps = ps_init(config);
    if (ps == NULL) {
        fprintf(stderr, "Failed to create recognizer, see log for details\n");
        return -1;
    }

    // Open the wav file passed from argument
    printf("file: %s\n", argv[1]);
    fh = fopen(argv[1], "rb");
    if (fh == NULL) {
        fprintf(stderr, "Unable to open input file %s\n", argv[1]);
        return -1;
    }

    // Start utterance
    rv = ps_start_utt(ps);
    
    // Process buffer, 512 samples at a time
    while (!feof(fh)) {
        size_t nsamp;
        nsamp = fread(buf, 2, 512, fh);
        rv = ps_process_raw(ps, buf, nsamp, FALSE, FALSE);
    }
    
    // Recieve the recognized string
    rv = ps_end_utt(ps);
    hyp = ps_get_hyp(ps, &score);
    printf("Recognized: |%s|\n", hyp);

    // free memory
    fclose(fh);
    ps_free(ps);
    cmd_ln_free_r(config);
    
    return 0;
}
